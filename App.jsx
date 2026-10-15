import React, { useState } from "react";

const BENCHMARK_ML = 0.26;
const REFERENCE_PROMPT_WORDS = 20;
const ML_PER_DROP = BENCHMARK_ML / 5;

function countWords(text) {
	return text.trim().split(/\s+/u).filter(Boolean).length;
}

function formatWater(ml) {
	return `${ml < 0.1 ? ml.toFixed(3) : ml.toFixed(2)}`;
}

function DropMark() {
	return (
		<svg viewBox="0 0 36 44" aria-hidden="true" className="drop-mark">
			<path
				d="M18 2.5C18 2.5 4.5 19.3 4.5 28.2a13.5 13.5 0 1 0 27 0C31.5 19.3 18 2.5 18 2.5Z"
				fill="currentColor"
			/>
			<path
				d="M11.5 28.5a6.5 6.5 0 0 0 6.5 6.5"
				fill="none"
				stroke="white"
				strokeLinecap="round"
				strokeWidth="2.5"
			/>
		</svg>
	);
}

function ArrowIcon() {
	return (
		<svg viewBox="0 0 20 20" aria-hidden="true">
			<path
				d="M4 10h11M10 5l5 5-5 5"
				fill="none"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="1.7"
			/>
		</svg>
	);
}

export default function App() {
	const [prompt, setPrompt] = useState("");
	const [submittedPrompt, setSubmittedPrompt] = useState("");
	const [error, setError] = useState("");
	const wordCount = countWords(submittedPrompt);
	const waterMl = (BENCHMARK_ML * wordCount) / REFERENCE_PROMPT_WORDS;
	const dropCount = waterMl / ML_PER_DROP;

	function handleSubmit(event) {
		event.preventDefault();
		const trimmedPrompt = prompt.trim();

		if (!trimmedPrompt) {
			setError("Write a prompt first to see its estimated footprint.");
			setSubmittedPrompt("");
			return;
		}

		setError("");
		setSubmittedPrompt(trimmedPrompt);
	}

	return (
		<main className="page-shell">
			<header className="topbar">
				<a className="brand" href="#" aria-label="Ripple home">
					<span className="brand-mark">
						<DropMark />
					</span>
					<span>
						How much water does AI use<span className="brand-period">?</span>
					</span>
				</a>
				<div className="topbar-note">
					<span className="status-dot" />
					<span>AI WATER ESTIMATOR</span>
				</div>
			</header>
			<section className="workspace" aria-label="Prompt water estimate">
				<div className="prompt-card">
					<div className="card-heading">
						<div>
							<span className="step-label">01 / YOUR PROMPT</span>
							<h2>What are you asking AI?</h2>
						</div>
						<span className="text-only-label">
							<span /> TEXT ONLY
						</span>
					</div>

					<form onSubmit={handleSubmit}>
						<label className="visually-hidden" htmlFor="prompt">
							Type an AI prompt
						</label>
						<textarea
							id="prompt"
							value={prompt}
							onChange={(event) => {
								setPrompt(event.target.value);
								if (error) setError("");
							}}
							onKeyDown={(event) => {
								if (event.key === "Enter" && !event.shiftKey) {
									event.preventDefault();
									event.currentTarget.form.requestSubmit();
								}
							}}
							placeholder="e.g. Explain how rainbows form in simple terms…"
							rows={5}
							maxLength={2000}
							aria-describedby={
								error ? "prompt-error prompt-hint" : "prompt-hint"
							}
							aria-invalid={Boolean(error)}
						/>
						<div className="form-footer">
							<span id="prompt-hint" className="keyboard-hint">
								<kbd>↵</kbd> to estimate <span className="hint-divider">·</span>{" "}
								<kbd>shift</kbd> + <kbd>↵</kbd> for a new line
							</span>
							<span className="character-count">{prompt.length} / 2,000</span>
						</div>
						{error && (
							<p className="form-error" id="prompt-error" role="alert">
								{error}
							</p>
						)}
						<button className="estimate-button" type="submit">
							Estimate water use <ArrowIcon />
						</button>
					</form>
				</div>

				<aside
					className={`result-card${submittedPrompt ? " has-result" : ""}`}
					aria-live="polite"
				>
					<div className="result-topline">
						<span className="step-label">02 / ESTIMATED FOOTPRINT</span>
						<span className="result-icon">
							<DropMark />
						</span>
					</div>
					{submittedPrompt ? (
						<>
							<p className="result-kicker">THIS PROMPT USES ABOUT</p>
							<div className="result-number">
								{formatWater(waterMl)}
								<span>mL</span>
							</div>
							<div className="result-rule" />
							<div className="drops-row">
								<span>
									About{" "}
									{dropCount < 1 ? dropCount.toFixed(1) : Math.round(dropCount)}{" "}
									drops of water
								</span>
							</div>
							<p className="submitted-quote">“{submittedPrompt}”</p>
							<p className="result-caveat">
								Scaled from {wordCount} words. Actual use varies.
							</p>
						</>
					) : (
						<div className="empty-result">
							<div className="empty-ripple" aria-hidden="true">
								<span />
								<span />
								<span />
							</div>
							<h2>
								Your estimate
								<br />
								will appear here.
							</h2>
							<p>Type a prompt and press enter to see its water footprint.</p>
						</div>
					)}
					<div className="benchmark">
						<span className="benchmark-mark">
							<DropMark />
						</span>
						<span>
							REFERENCE
							<br />
							<strong>0.26 mL / 20-word ref.</strong>
						</span>
					</div>
				</aside>
			</section>

			<section className="method" aria-label="About this estimate">
				<div className="method-icon" aria-hidden="true">
					i
				</div>
				<div className="method-copy">
					<h2>This is an estimate, not a universal constant.</h2>
					<p>
						{" "}
						This is a rough comparison, not a measured per-word formula; model,
						response length, location, and cooling can all change real water
						use.
					</p>
				</div>
				<div className="method-side-note">
					<span>ONE TEXT PROMPT</span>
					<strong>≈ 0.013 mL / word</strong>
					<span>rough length-based estimate</span>
				</div>
			</section>
			<footer className="page-footer">
				<span>ESTIMATES ARE APPROXIMATE</span>
			</footer>
		</main>
	);
}
