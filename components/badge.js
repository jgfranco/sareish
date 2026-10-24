// small pill shown next to a link, e.g. "New" or "Featured"
export default function Badge({ label, className = '' }) {
    return (
        <span className={`inline-block ml-2 px-2 py-0.5 rounded-full bg-rose-700 text-white text-[10px] font-bold uppercase tracking-wide align-middle ${className}`}>
            {label}
        </span>
    );
}
