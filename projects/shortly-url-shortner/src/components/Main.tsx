import Links from './Links'
import Form from './Form'
import { useLinks } from '../context/links'

const Main = () => {
  const { links } = useLinks()
  return (
    <main>
      <Form />
      <section>
        {links.length !== 0 &&
          links.map(link => (
            <Links
              key={link.code}
              original={link.originalUrl}
              shorter={link.fullShortUrl}
            />
          ))}
      </section>
    </main>
  )
}

export default Main
