import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('React error:', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <pre style={{
          color: '#e94560',
          padding: 24,
          whiteSpace: 'pre-wrap',
          fontFamily: 'monospace',
          fontSize: 14,
          lineHeight: 1.5,
        }}>
          {this.state.error.message + '\n' + (this.state.error.stack || '')}
        </pre>
      );
    }
    return this.props.children;
  }
}
