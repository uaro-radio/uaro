export default function Image({ src, alt = 'Image', width = 300, height = 400 }) {
    return (
        <div>
            <img src={src} alt={alt} width={width} height={height} />
        </div>
    );
}