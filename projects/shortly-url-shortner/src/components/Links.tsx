import { useCallback } from 'react'

const Links: React.FC<LinksProps> = ({ original, shorter }) => {
  const copyLink: React.MouseEventHandler<HTMLButtonElement> = useCallback(
    e => {
      navigator.clipboard.writeText(shorter)
      const btn = e.currentTarget

      btn.innerHTML = 'Copied!'
      btn.classList.add('copied')
      setTimeout(() => {
        btn.innerHTML = 'Copy'
        btn.classList.remove('copied')
      }, 5000)
    },
    [shorter]
  )

  return (
    <div className="shortened">
      <div className="link-short">
        <h5>{original}</h5>
        <h5>{shorter}</h5>
      </div>
      <div className="copy-link">
        <button className="copy" onClick={copyLink}>
          Copy
        </button>
      </div>
    </div>
  )
}

export default Links

export interface LinksProps {
  original: string
  shorter: string
}
