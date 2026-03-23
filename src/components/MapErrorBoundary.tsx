import { Component, ReactNode } from "react";
import "./MapDisplay.css";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    message: string;
}

export class MapErrorBoundary extends Component<Props, State> {
    state: State = { hasError: false, message: "" };

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, message: error.message };
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="map-error-boundary">
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="32" height="32">
                            <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
                            <line x1="8" y1="2" x2="8" y2="18" />
                            <line x1="16" y1="6" x2="16" y2="22" />
                        </svg>
                        <p>Map unavailable</p>
                        <p>{this.state.message}</p>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}
