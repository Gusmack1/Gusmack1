export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ fontFamily: 'var(--font-playfair)' }}>Contact</h1>
        <p className="mt-2 text-neutral-700">For partnerships, media, and feedback.</p>
        <form className="mt-6 grid grid-cols-1 gap-4 max-w-xl">
          <input className="h-10 px-3 rounded-md border border-black/10" placeholder="Name" />
          <input className="h-10 px-3 rounded-md border border-black/10" placeholder="Email" type="email" />
          <textarea className="h-32 px-3 py-2 rounded-md border border-black/10" placeholder="Message" />
          <button className="h-10 rounded-md bg-black text-white px-4 w-fit">Send</button>
        </form>
      </div>
    </main>
  );
}


