export interface QBankQuery {
  libType: string // 题库名称
}
export interface QBankResData {
  id: number
  libType: string
  createTime: string
}

export interface PaperListResData extends QBankResData {

}