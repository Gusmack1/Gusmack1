export default function DataDeletionPage() {
	return (
		<main className="min-h-screen bg-white text-black">
			<div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
				<h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
					Data Deletion Policy
				</h1>
				<p className="mt-4 text-neutral-700">
					We respect your privacy and comply with applicable data protection laws. This page explains how to request deletion of personal data related to GusMack Food Reviews.
				</p>
				<h2 className="mt-8 text-2xl font-semibold">What data we hold</h2>
				<ul className="mt-3 list-disc pl-6 text-neutral-700">
					<li>Voluntary information you submit (e.g., comments).</li>
					<li>Operational website logs (for security and performance).</li>
					<li>Publicly available social media content that you posted on your own accounts (e.g., Instagram captions and images exported by the account owner). This content is owned by the account owner and may be removed by the owner at any time.</li>
				</ul>
				<h2 className="mt-8 text-2xl font-semibold">How to request deletion</h2>
				<p className="mt-3 text-neutral-700">
					Send a request with subject “Data Deletion Request” including sufficient identifying details to:
				</p>
				<p className="mt-2 text-neutral-800 font-medium">privacy@gusmack1.com</p>
				<p className="mt-2 text-neutral-700">
					We will verify your identity, assess the request, and respond within 30 days. If the request concerns third-party platform content (e.g., Instagram), we may direct you to remove it at the source if we are not the controller of that data.
				</p>
				<h2 className="mt-8 text-2xl font-semibold">Retention</h2>
				<p className="mt-3 text-neutral-700">
					We retain data only as long as necessary for site operation, security, legal compliance, and legitimate interests. Backups may persist for a limited period before being purged.
				</p>
				<h2 className="mt-8 text-2xl font-semibold">Contact</h2>
				<p className="mt-3 text-neutral-700">
					For questions about this policy, contact <span className="font-medium">privacy@gusmack1.com</span>.
				</p>
			</div>
		</main>
	);
}
