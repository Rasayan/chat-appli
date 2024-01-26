import Image from 'next/image'
import styles from '../../styles/page.module.css'

const imageStyle = {
  marginTop: '2em'
}

export default function Home() {

  return (
    <main className={styles.main}>
      <div className={styles.maincomp}>
        <div className={styles.mainheading}>
          <h2>Future of secure chatting_</h2>
          <h1>with <span className={styles.mainheadspan}>ZapChat</span></h1>
        </div>

        <div className={styles.maindisplayimg}>
          <Image
            src="/Group 39.png"
            width={500}
            height={110}
            alt="Picture of the author"
            quality={100}
            style={imageStyle}
            loading="lazy"
          />
          <Image
            src="/Group 40.png"
            width={500}
            height={110}
            alt="Picture of the author"
            quality={100}
            loading="lazy"
          />
        </div>

        <div className={styles.mainbuttons}>
          <button className={styles.mainbutton1}>Why Us?</button>
          <button className={styles.mainbutton2}><a href='/chat'>Get Started</a></button>
        </div>
      </div>
    </main>
  )
}
