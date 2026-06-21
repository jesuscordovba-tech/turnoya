import { Component, type ReactNode, type ErrorInfo } from 'react'
import { Button } from './Button'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <h2 className="text-lg font-semibold text-gray-900">Algo salió mal</h2>
          <p className="mt-1 text-sm text-gray-500">
            {this.state.error?.message || 'Error inesperado'}
          </p>
          <Button
            variant="secondary"
            className="mt-4"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Intentar de nuevo
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}
