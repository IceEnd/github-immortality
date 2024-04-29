export interface IStats {
  name: string,
  totalPRs: number,
  totalPRsMerged: number,
  mergedPRsPercentage: number,
  totalReviews: number,
  totalCommits: number,
  totalIssues: number,
  totalStars: number,
  totalDiscussionsStarted: number,
  totalDiscussionsAnswered: number,
  contributedTo: number,
  rank: number,
}

// 在《凡人修仙传》中，修仙者的境界分为不同的阶段，具体可以划分如下：
// 下境界：
// 炼气：十三层，修炼者开始吸收天地灵气，转化为自身法力。寿元同凡人无异。
// 筑基：分为初、中、后期和大圆满。修炼者用法力凝聚筑基，形成自身修炼基础。寿元为200岁。
// 结丹：凝结出金丹，寿元增加。
// 元婴：形成元婴，寿元进一步延长。
// 化神：自我精神材质化，寿元增加。
// 中境界：6. 炼虚：自我精神物质化，进一步增强。7. 合体：合并神识，大幅度增强实力。8. 大乘：最后阶段，实力跨入顶尖。
// 上境界：9. 渡劫：经过劫难，成功渡过即可飞升仙界，与天地同寿。
// 这些境界的划分不仅仅是实力的提升，更是修仙者对道的探讨和理解。随着境界的提升，修仙者的寿命会有所增加，最终达到与天地同寿的程度。
// 以上信息可能存在些许误差，是根据相关资讯整理，具体内容建议查阅原著。

// user levels
export enum StatsLevel {
  A = 'A',
  B = ''
}
