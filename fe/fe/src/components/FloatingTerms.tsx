// All terms in one pool — will be randomly assigned colors
const allTerms = [
    "Joint Liability", "Subletting", "Pet Clause", "Severability",
    "Force Majeure", "Entry Rights", "Indemnity", "Assignment",
    "Holdover", "Insurance", "Parking", "Noise Rules",
    "Move-In Check", "Modification", "Deposit", "Duration",
    "Rent Schedule", "Property Use", "Renewal", "Landlord Duties",
    "Tenant Rights", "Disputes", "Governing Law", "Occupancy",
    "Fair Wear", "Grace Period", "Deposit Return", "Rent Cap",
    "Notice Period", "Late Fees", "Auto-Renewal", "Hidden Fees",
    "Penalty", "Waiver", "Non-Refundable", "Quiet Enjoyment",
    "Arbitration", "Termination", "Lease Term", "Compliance",
];

// Deterministic "random" type assignment: ~70% neutral, ~15% green, ~15% red
const typePattern: ('neutral' | 'good' | 'bad')[] = [
    'neutral', 'neutral', 'neutral', 'neutral', 'neutral', 'good', 'bad',
    'neutral', 'neutral', 'neutral', 'bad', 'neutral', 'neutral', 'good',
    'neutral', 'neutral', 'neutral', 'neutral', 'good', 'neutral', 'bad',
    'neutral', 'neutral', 'neutral', 'neutral', 'bad', 'neutral', 'good',
    'neutral', 'neutral', 'neutral', 'neutral', 'good', 'neutral', 'bad',
    'neutral', 'neutral', 'neutral', 'neutral', 'good',
];

// Sizes and rotations for variety
const sizes = ['text-[10px]', 'text-xs', 'text-[11px]', 'text-[10px]', 'text-xs', 'text-[9px]'];
const rotations = ['-2deg', '1deg', '0deg', '-1deg', '2deg', '-3deg', '3deg', '0deg'];

// Only OUTSIDE the centered content (max-w-7xl ~ 20% to 80%)
// LEFT: 2%–14%   |   RIGHT: pushed far right but won't clip (use right-based positioning)
const leftPositions = [
    { left: '1.5%', top: '80px' },
    { left: '4%', top: '150px' },
    { left: '1.5%', top: '220px' },
    { left: '6%', top: '290px' },
    { left: '1.5%', top: '360px' },
    { left: '4%', top: '430px' },
    { left: '7%', top: '500px' },
    { left: '1.5%', top: '570px' },
    { left: '5%', top: '640px' },
    { left: '1.5%', top: '710px' },
    { left: '8%', top: '120px' },
    { left: '3%', top: '185px' },
    { left: '9%', top: '260px' },
    { left: '1.5%', top: '330px' },
    { left: '6%', top: '400px' },
    { left: '3%', top: '470px' },
    { left: '10%', top: '540px' },
    { left: '1.5%', top: '610px' },
    { left: '5%', top: '680px' },
    { left: '3%', top: '750px' },
];

export default function FloatingTerms() {
    return (
        <div
            className="absolute top-0 left-0 w-full pointer-events-none select-none z-0 overflow-hidden"
            style={{ height: '780px' }}
            aria-hidden="true"
        >
            {/* LEFT SIDE TERMS */}
            {allTerms.slice(0, 20).map((term, i) => {
                const pos = leftPositions[i];
                const type = typePattern[i];
                const colorClass =
                    type === 'good' ? 'text-green-600/50' :
                        type === 'bad' ? 'text-red-500/50' :
                            'text-[#5A4231]/20';

                return (
                    <span
                        key={`l-${i}`}
                        className={`absolute font-black uppercase tracking-[0.15em] whitespace-nowrap ${sizes[i % sizes.length]} ${colorClass}`}
                        style={{
                            left: pos.left,
                            top: pos.top,
                            transform: `rotate(${rotations[i % rotations.length]})`,
                        }}
                    >
                        {term}
                    </span>
                );
            })}

            {/* RIGHT SIDE TERMS — use `right` instead of `left` to prevent clipping */}
            {allTerms.slice(20).map((term, i) => {
                const type = typePattern[20 + i];
                const topVal = 90 + i * 70;
                const rightVal = [2, 6, 3, 8, 4, 10, 5, 7, 3, 9, 2, 6, 4, 8, 11, 3, 7, 5, 9, 2][i % 20];
                const colorClass =
                    type === 'good' ? 'text-green-600/50' :
                        type === 'bad' ? 'text-red-500/50' :
                            'text-[#5A4231]/20';

                return (
                    <span
                        key={`r-${i}`}
                        className={`absolute font-black uppercase tracking-[0.15em] whitespace-nowrap ${sizes[i % sizes.length]} ${colorClass}`}
                        style={{
                            right: `${rightVal}%`,
                            top: `${topVal}px`,
                            transform: `rotate(${rotations[i % rotations.length]})`,
                        }}
                    >
                        {term}
                    </span>
                );
            })}

            {/* TOP STRIP — horizontal row between header and hero content (~70px-100px) */}
            {['Lease Agreement', 'Rental Terms', 'Binding Contract', 'Tenant Clause', 'Landlord Policy', 'Legal Document'].map((term, i) => {
                const types: ('neutral' | 'good' | 'bad')[] = ['neutral', 'good', 'neutral', 'bad', 'neutral', 'good'];
                const type = types[i];
                const colorClass =
                    type === 'good' ? 'text-green-600/40' :
                        type === 'bad' ? 'text-red-500/40' :
                            'text-[#5A4231]/15';
                return (
                    <span
                        key={`t-${i}`}
                        className={`absolute font-black text-[9px] uppercase tracking-[0.2em] whitespace-nowrap ${colorClass}`}
                        style={{
                            left: `${15 + i * 14}%`,
                            top: '100px',
                            transform: `rotate(${[-1, 1, 0, -2, 1, -1][i]}deg)`,
                        }}
                    >
                        {term}
                    </span>
                );
            })}

            {/* BOTTOM STRIP — horizontal row between hero content and Features (~780px-830px) */}
            {['Due Diligence', 'Risk Assessment', 'Clause Review', 'Deposit Terms', 'Rent Obligations', 'Property Rights'].map((term, i) => {
                const types: ('neutral' | 'bad' | 'good')[] = ['neutral', 'bad', 'neutral', 'neutral', 'good', 'neutral'];
                const type = types[i];
                const colorClass =
                    type === 'good' ? 'text-green-600/40' :
                        type === 'bad' ? 'text-red-500/40' :
                            'text-[#5A4231]/15';
                return (
                    <span
                        key={`b-${i}`}
                        className={`absolute font-black text-[9px] uppercase tracking-[0.2em] whitespace-nowrap ${colorClass}`}
                        style={{
                            left: `${18 + i * 13}%`,
                            top: '720px',
                            transform: `rotate(${[1, -1, 2, 0, -2, 1][i]}deg)`,
                        }}
                    >
                        {term}
                    </span>
                );
            })}
        </div>
    );
}
