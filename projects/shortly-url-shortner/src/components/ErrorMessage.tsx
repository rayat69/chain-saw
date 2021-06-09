import FormHelperText from '@material-ui/core/FormHelperText'
import { ErrorMessage as ErrorMessageCore } from '@hookform/error-message'

const ErrorMessage: typeof ErrorMessageCore = props => {
  return <ErrorMessageCore {...props} as={FormHelperText} />
}

export default ErrorMessage
