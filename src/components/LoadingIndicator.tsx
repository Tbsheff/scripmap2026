/*======================================================================
 * FILE:    LoadingIndicator.tsx
 * AUTHOR:  Stephen W. Liddle
 * DATE:    Winter 2026
 *
 * DESCRIPTION: Editorial loading states that mirror the content layout.
 */

const SKELETON_LINE_WIDTHS = Array.from({ length: 8 }, (_, i) => `${75 + Math.sin(i * 1.7) * 20}%`);

function SkeletonHeader() {
	return (
		<div className="mb-8 pb-4">
			<div className="skeleton w-20 h-[0.65rem] rounded-sm mb-3" />
			<div className="skeleton w-56 h-7 rounded-md" />
		</div>
	);
}

export default function LoadingIndicator() {
	return (
		<div
			role="status"
			aria-live="polite"
			className="w-full px-10 py-8 max-w-[1400px] mx-auto max-[44rem]:px-4 max-[44rem]:py-5"
		>
			<span className="sr-only">Loading...</span>
			<SkeletonHeader />
			<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
				{Array.from({ length: 12 }, (_, i) => (
					<div
						key={`skeleton-${i}`}
						className="skeleton aspect-[4/3] rounded-xl"
						style={{ animationDelay: `${i * 60}ms` }}
					/>
				))}
			</div>
		</div>
	);
}

export function ChapterLoadingIndicator() {
	return (
		<div
			role="status"
			aria-live="polite"
			className="w-full px-10 py-8 max-w-[1400px] mx-auto max-[44rem]:px-4 max-[44rem]:py-5"
		>
			<span className="sr-only">Loading chapters...</span>
			<SkeletonHeader />
			<div className="grid gap-[0.625rem]" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(3.5rem, 1fr))" }}>
				{Array.from({ length: 20 }, (_, i) => (
					<div
						key={`skeleton-${i}`}
						className="skeleton aspect-square rounded-xl"
						style={{ animationDelay: `${i * 30}ms` }}
					/>
				))}
			</div>
		</div>
	);
}

export function ScriptureLoadingIndicator() {
	return (
		<div
			role="status"
			aria-live="polite"
			className="w-full max-w-[36rem] mx-auto px-10 py-12 max-[44rem]:px-6 max-[44rem]:py-8"
		>
			<span className="sr-only">Loading scripture...</span>
			<div className="flex flex-col items-center gap-3 mb-12">
				<div className="skeleton w-48 h-[0.6rem] rounded-sm" />
				<div className="skeleton w-40 h-12 rounded-md" />
				<div className="skeleton w-48 h-[0.6rem] rounded-sm" />
			</div>
			<div className="flex flex-col gap-4">
				{SKELETON_LINE_WIDTHS.map((width) => (
					<div
						key={width}
						className="skeleton h-[0.85rem] rounded-sm"
						style={{ animationDelay: `${200 + SKELETON_LINE_WIDTHS.indexOf(width) * 50}ms`, width }}
					/>
				))}
			</div>
		</div>
	);
}
