import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AppProvider } from './context/AppContext.jsx'

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false, error: null, info: null }
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error }
    }
    componentDidCatch(error, info) {
        console.error('App crash:', error, info)
        this.setState({ info })
    }
    render() {
        if (this.state.hasError) {
            return (
                <div style={{ background: '#0a0a0a', color: '#fff', minHeight: '100vh', padding: '40px', fontFamily: 'monospace' }}>
                    <h1 style={{ color: '#f87171', marginBottom: '16px' }}>⚠ App crashed</h1>
                    <pre style={{ background: '#1a1a1a', padding: '20px', borderRadius: '8px', color: '#fbbf24', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                        {this.state.error?.toString()}
                    </pre>
                    {this.state.info && (
                        <pre style={{ background: '#1a1a1a', padding: '20px', borderRadius: '8px', color: '#94a3b8', marginTop: '16px', whiteSpace: 'pre-wrap', fontSize: '12px', wordBreak: 'break-all' }}>
                            {this.state.info.componentStack}
                        </pre>
                    )}
                </div>
            )
        }
        return this.props.children
    }
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ErrorBoundary>
            <AppProvider>
                <App />
            </AppProvider>
        </ErrorBoundary>
    </React.StrictMode>,
)
