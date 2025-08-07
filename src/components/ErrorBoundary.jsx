// import { Component } from 'react';

// class ErrorBoundary extends Component {
//   state = { hasError: false };

//   static getDerivedStateFromError(error) {
//     return { hasError: true };
//   }

//   componentDidCatch(error, info) {
//     console.error('Error Boundary caught:', error, info);
//   }

//   render() {
//     if (this.state.hasError) {
//       return <div className="text-red-500 p-4">QR Code failed to load</div>;
//     }
//     return this.props.children;
//   }
// }

// export default ErrorBoundary;



import { Component } from 'react';

export default class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="text-red-500 p-4">
          AR rendering failed: {this.state.error?.message}
        </div>
      );
    }
    return this.props.children;
  }
}