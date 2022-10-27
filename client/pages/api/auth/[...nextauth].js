import { sign } from "tweetnacl";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import DiscordProvider from "next-auth/providers/discord";
import TwitterProvider from "next-auth/providers/twitter";
import { getSession } from "next-auth/react";
const Web3 = require("@solana/web3.js");
import { Transaction } from "@solana/web3.js";
const bs58 = require("bs58");
const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const nextAuthOptions = (req, res) => {
  return {
    providers: [
      DiscordProvider({
        clientId: process.env.DISCORD_CLIENT_ID,
        clientSecret: process.env.DISCORD_CLIENT_SECRET,
        error: "dvs.thedogecapital.com/connect",
        authorization: { params: { scope: "identify", response_type: "code" } },
        profile: async (profile) => {
          const session = await getSession({ req });
          return fetch(`${baseUrl}/users/add`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: session.user.id,
              discordId: profile.id,
            }),
          }).then((res) => {
            if (res.ok) {
              return {
                id: session.user.id,
                discordId: profile.id,
                discordUsername: profile.username,
                twitterId: session.user.twitterId,
                wallets: session.user.wallets,
              };
            } else
              return { id: session.user.id, twitterId: session.user.twitterId };
          });
        },
      }),
      TwitterProvider({
        clientId: process.env.TWITTER_CLIENT_ID,
        clientSecret: process.env.TWITTER_CLIENT_SECRET,
        profile: async (profile) => {
          const session = await getSession({ req });
          return fetch(`${baseUrl}/users/add`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              twitterId: profile.id_str,
              id: session.user.id,
              discordId: session.user.discordId,
            }),
          }).then((res) => {
            if (res.ok) {
              return {
                id: session.user.id,
                discordId: session.user.discordId,
                twitterId: profile.id_str,
                wallets: session.user.wallets,
              };
            } else
              return {
                id: session.user.id,
                discordId: session.user.discordId,
                wallets: session.user.wallets,
              };
          });
        },
      }),
      CredentialsProvider({
        async authorize(credentials) {
          try {
            if (credentials.publicKey && credentials.type) {
              try {
                if (credentials.type === "0") {
                  const nonce = req.cookies["auth-nonce"];
                  const message = `$VAPE: ${nonce}`;
                  const messageBytes = new TextEncoder().encode(message);
                  const publicKeyBytes = bs58.decode(credentials.publicKey);
                  const signatureBytes = bs58.decode(credentials.signature);
                  const result = sign.detached.verify(
                    messageBytes,
                    signatureBytes,
                    publicKeyBytes
                  );
                  if (!result) {
                    throw new Error("user can not be authenticated");
                  }
                } else if (credentials.type === "1") {
                  const recoveredTransaction = Transaction.from(
                    Buffer.from(credentials.signature, "base64")
                  );
                  console.log(recoveredTransaction);
                  const verifySign = recoveredTransaction.verifySignatures();
                  if (
                    verifySign == false ||
                    recoveredTransaction.signatures[0].publicKey !=
                      credentials.publicKey
                  ) {
                    throw new Error("user can not be authenticated");
                  }
                } else throw new Error("user can not be authenticated");
              } catch (err) {
                console.log(err);
                throw new Error("user can not be authenticated");
              }
              return fetch(`${baseUrl}/users/add`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  publicKey: credentials.publicKey,
                  id: credentials.id,
                }),
              }).then((res) => {
                if (res.ok) {
                  return res.json().then((r) => {
                    return r;
                  });
                } else {
                  return {
                    message: "User can not be authenticated",
                  };
                }
              });
            } else if (credentials.username) {
              try {
                return fetch(`${baseUrl}/admins/login`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    username: credentials.username,
                    password: credentials.password,
                  }),
                }).then((res) => {
                  if (res.ok) {
                    return {
                      username: credentials.username,
                      role: "admin",
                    };
                  } else throw new Error("Invalid Username or Password");
                });
              } catch (error) {
                throw new Error(error);
              }
            }
          } catch (error) {
            console.log(error);
            return { error: "Sorry, something went wrong" };
          }
        },
      }),
    ],
    callbacks: {
      jwt: async ({ token, user }) => {
        
        user && (token.user = user);
        return token;
      },
      session: async ({ session, token }) => {
        
        session.user = token.user;
        

        return session;
      },
    },
    secret: process.env.NEXTAUTH_SECRET,
  };
};

export default (req, res) => {
  return NextAuth(req, res, nextAuthOptions(req, res));
};
