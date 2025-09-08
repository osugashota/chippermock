import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error);
    console.error('Error info:', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 bg-gray-50 min-h-screen">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-red-700 font-bold text-xl mb-2">エラーが発生しました</h2>
            <p className="text-red-600 mb-4">画面の読み込み中にエラーが発生しました。</p>
            {this.state.error && (
              <div className="bg-white border border-red-300 rounded p-4">
                <p className="text-sm font-mono text-red-600 mb-2">{this.state.error.message}</p>
                <details className="text-xs text-gray-600">
                  <summary className="cursor-pointer hover:text-gray-800">詳細情報</summary>
                  <pre className="mt-2 overflow-auto">{this.state.error.stack}</pre>
                </details>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}