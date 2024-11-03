import styles from './SpotifyLoginButton.module.css'
import Image from 'next/image'

export function normal(props) {
    return <a href="/api/login" {...props} style={{width: props.width}} className={[styles.btn, styles.green].join(' ')}>
        <div className={styles.container}>
            <Image src="/SpotifyIcons/Spotify_Icon_RGB_White.png" alt="Spotify Logo" width={30} height={30} />
            <div className={styles.text}>Login with Spotify</div>
        </div>
    </a>
}

export function small(props) {
    return <a href="/api/login" {...props} style={{width: props.width}} className={[styles.btn, styles.grey].join(' ')}>
    <div className={styles.container}>
        <Image src="/SpotifyIcons/Spotify_Icon_RGB_Green.png" alt="Spotify Logo" width={20} height={20} />
        <div className={styles.text}>Login</div>
    </div>
    </a>
}

export default {normal, small};