export type FrontierPoint = {
  risk: number
  expectedReturn: number
  riskAversion: number
  weights: Float64Array<ArrayBuffer>
}

export type FrontierParams = {
  covariance: Float64Array<ArrayBuffer>
  expectedReturns: Float64Array<ArrayBuffer>
  assetCount: number
  points?: number
  lambdaMin?: number
  lambdaMax?: number
  longOnly?: boolean
  ridge?: number
}

export type Dataset = {
  note: string
  tickers: string[]
  names: string[]
  periodsPerYear: number
  /** Monthly simple returns, one row per period, one column per ticker. */
  returns: number[][]
}

export type Vec3 = [number, number, number]

export type NBodyBody = {
  label: string
  color: string
  position: Vec3
  velocity: Vec3
  mass: number
}

export type NBodyReadout = {
  t: number
  steps: number
  energyDrift: number
}
