import { Component, type ReactNode } from "react";

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
				<div className="flex items-center justify-center h-full p-8 text-center text-[var(--on-surface-variant)] text-[0.9rem]">
					<div>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinecap="round"
							strokeLinejoin="round"
							width="32"
							height="32"
							className="mb-3 opacity-50"
						>
							<polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
							<line x1="8" y1="2" x2="8" y2="18" />
							<line x1="16" y1="6" x2="16" y2="22" />
						</svg>
						<p className="m-0">Map unavailable</p>
						<p className="m-0 mt-1 text-[0.8rem] opacity-70">{this.state.message}</p>
					</div>
				</div>
			);
		}
		return this.props.children;
	}
}
