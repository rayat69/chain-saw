import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from '@fortawesome/react-fontawesome'
import {
  faFacebookF,
  faInstagram,
  faPinterest,
  faTwitter,
} from '@fortawesome/free-brands-svg-icons'

import logoBottom from '../images/logo-bottom.svg'

const Footer = () => {
  const iconProps: Omit<FontAwesomeIconProps, 'icon'> = {
    size: '2x',
    color: '#fff',
    style: {
      margin: '0 10px',
    },
  }
  return (
    <footer>
      <div className="secs sec1">
        <img src={logoBottom} alt="Bottom Logo" />
      </div>
      <div className="secs sec2">
        <div className="options option1">
          <h3>Features</h3>
          <span>Link Shortening</span>
          <span>Branded Links</span>
          <span>Analytics</span>
        </div>
        <div className="options option2">
          <h3>Resources</h3>
          <span>Blog</span>
          <span>Developer</span>
          <span>Support</span>
        </div>
        <div className="options option3">
          <h3>Company</h3>
          <span>About</span>
          <span>Our Team</span>
          <span>Careers</span>
          <span>Contact</span>
        </div>
      </div>
      <div className="secs sec3">
        {/* <i className="fa fa-facebook-official"></i> */}
        <FontAwesomeIcon {...iconProps} icon={faFacebookF} />
        <FontAwesomeIcon {...iconProps} icon={faTwitter} />
        <FontAwesomeIcon {...iconProps} icon={faPinterest} />
        <FontAwesomeIcon {...iconProps} icon={faInstagram} />
      </div>
    </footer>
  )
}

export default Footer
