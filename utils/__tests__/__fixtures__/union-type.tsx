type Products = 'boundary' | 'waypoint' | 'nomad'

interface Props {
  product: Products
}

export default function UnionType({ product }: Props) {
  return <div />
}
