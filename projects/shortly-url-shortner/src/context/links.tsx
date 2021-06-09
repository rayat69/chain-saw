import { createContext, useContext, useEffect, useState } from 'react'
// import { useLocalStorage } from '@utils/hooks'
// import { LinksProps } from '../components/Links'
import { shortUrlRef } from '../utils/firebase'
import { RetrieveURL } from '../utils/shortUrl'

const LinksContext = createContext<LinksContextType>({
  links: [],
  setLinks: () => {},
})

export const useLinks = () => useContext(LinksContext)

export const LinksProvider: React.FC = ({ children }) => {
  // const [links, setLinks] = useLocalStorage<RetrieveURL[]>('fields', [])
  const [links, setLinks] = useState<RetrieveURL[]>([])

  useEffect(() => {
    shortUrlRef
      .orderByChild('uid')
      .equalTo('user:mamu')
      .on(
        'value',
        snapshot => {
          if (!snapshot.exists()) {
            return
          }
          // const docs = snapshot.val()
          // const id = snapshot.key!
          // console.log(docs)
          let docs: RetrieveURL[] = []
          snapshot.forEach(doc => {
            docs.push(new RetrieveURL({ ...doc.val() }, doc.key!))
          })

          // const data = new RetrieveURL({ ...docs }, id)
          setLinks(prev => [...prev, ...docs])
          console.log(docs)
        },
        error => {
          console.log(error.message)
        }
      )
    return () => shortUrlRef.off('value')
  }, [setLinks])

  return (
    <LinksContext.Provider value={{ links, setLinks }}>
      {children}
    </LinksContext.Provider>
  )
}

interface LinksContextType {
  links: RetrieveURL[]
  setLinks: React.Dispatch<React.SetStateAction<RetrieveURL[]>>
}
