import { useRouter } from 'next/router'

export default function Game() {
    const router = useRouter()
    const { theme, game } = router.query
console.log(router.query)
    return <div><p>Theme: { theme }</p><p>Game: { game }</p></div>
}
