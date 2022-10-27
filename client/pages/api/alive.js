export default function handler(req, res) {
    const a = { head: 'hi I am alive' }
    return res.status(200).send(a)
}