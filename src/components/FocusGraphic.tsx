import { focusAreas } from '../data/site'

function FocusGraphic() {
  return (
    <div className="focus-list">
      {focusAreas.map((area) => (
        <div key={area} className="focus-item">
          <span className="focus-dot" />
          <span>{area}</span>
        </div>
      ))}
    </div>
  )
}

export default FocusGraphic
