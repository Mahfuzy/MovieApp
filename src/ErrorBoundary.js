import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can log errorInfo to a monitoring service here if desired
    // console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-6">
          <div className="max-w-lg text-center">
            <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
            <p className="opacity-80 mb-4">Please try refreshing the page. If the issue persists, contact support.</p>
            <pre className="text-left whitespace-pre-wrap text-sm opacity-70">{String(this.state.error)}</pre>
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;


