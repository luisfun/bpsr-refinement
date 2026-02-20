<script lang="ts">
import NumberSelect from './number-select.svelte'
import { gearRefinementTable, type RefinementData, weaponRefinementTable } from './refinement-table'
import { buriTradePrice, craftTradePrice, mossTradePrice, star2TradePrice } from './tradePrice'

let star2Price = $state(star2TradePrice.at(0) || 0)
let craftPrice = $state(craftTradePrice.at(-1) || 0)
let buriPrice = $state(buriTradePrice.at(-1) || 0)
let mossPrice = $state(mossTradePrice.at(-1) || 0)
let isWeapon = $state(false)
let targetLevel = $state(weaponRefinementTable.at(-1)?.level || 0)
let results = $derived.by(() => {
  const entry = (isWeapon ? weaponRefinementTable : gearRefinementTable).find(e => e.level === targetLevel)
  if (!entry) throw new Error(`No refinement data for level ${targetLevel}`)
  return {
    regular: calcRecursiveCost(entry, 0, 0),
    buri1: calcRecursiveCost(entry, 1, 0),
    buri2: calcRecursiveCost(entry, 2, 0),
    buri3: calcRecursiveCost(entry, 3, 0),
    buri4: calcRecursiveCost(entry, 4, 0),
    buri5: calcRecursiveCost(entry, 5, 0),
    buri5Moss1: calcRecursiveCost(entry, 5, 1),
    allMoss: calcRecursiveCost(entry, 5, (1 - entry.success - 0.25) / 0.03), // 成功率が100%になるまでモスを投入
    regularAndBuri: calcRegularAndBuriCost(entry),
    regular1AndBuri: calcRegular1AndBuriCost(entry),
    regular1AndMoss: calcRegular1AndMossCost(entry),
    regularburi12345: calcRegular1Buri12345Cost(entry),
    buri54321Regular: calcBuri54321RegularCost(entry),
    buri5AndMoss: calcBuri5MossCost(entry),
    buri55AndMoss: calcBuri55MossCost(entry),
  }
})
let minimumCost = $derived(Math.min(...Object.values(results))) 

const calcCostRate = $derived((entry: RefinementData, buri: number, moss: number, successRate: number) => ({
  cost: entry.star * star2Price + entry.craft * craftPrice + buri * buriPrice + moss * mossPrice,
  rate: Math.round(Math.min(successRate + buri * 0.05 + moss * 0.03, 1) * 100) / 100
}))

const calcRecursiveCost = (entry: RefinementData, buri: number, moss: number, successRate = entry.success): number => {
  const { cost, rate } = calcCostRate(entry, buri, moss, successRate)
  if (1 <= rate) return cost
  return cost + calcRecursiveCost(entry, buri, moss, successRate + 0.02) * (1 - rate)
}

const calcRegularAndBuriCost = (entry: RefinementData, successRate = entry.success): number => {
  const buri = successRate < 0.75 ? 0 : 5
  const { cost, rate } = calcCostRate(entry, buri, 0, successRate)
  if (1 <= rate) return cost
  return cost + calcRegularAndBuriCost(entry, successRate + 0.02) * (1 - rate)
}

const calcRegular1AndBuriCost = (entry: RefinementData, successRate = entry.success): number => {
  const { cost, rate } = calcCostRate(entry, 0, 0, successRate)
  if (1 <= rate) return cost
  return cost + calcRecursiveCost(entry, 5, 0, successRate + 0.02) * (1 - rate)
}

const calcRegular1AndMossCost = (entry: RefinementData, successRate = entry.success): number => {
  const { cost, rate } = calcCostRate(entry, 0, 0, successRate)
  if (1 <= rate) return cost
  return cost + calcRecursiveCost(entry, 5, (1 - successRate - 0.02 - 0.25) / 0.03, successRate + 0.02) * (1 - rate)
}

const calcRegular1Buri12345Cost = (entry: RefinementData, buri = 0, successRate = entry.success): number => {
  const { cost, rate } = calcCostRate(entry, buri, 0, successRate)
  if (1 <= rate) return cost
  return cost + calcRecursiveCost(entry, Math.min(buri + 1 , 5), 0, successRate + 0.02) * (1 - rate)
}

const calcBuri54321RegularCost = (entry: RefinementData, buri = 5, successRate = entry.success): number => {
  const { cost, rate } = calcCostRate(entry, buri, 0, successRate)
  if (1 <= rate) return cost
  return cost + calcBuri54321RegularCost(entry, Math.max(buri - 1, 0), successRate + 0.02) * (1 - rate)
}

const calcBuri5MossCost = (entry: RefinementData, successRate = entry.success): number => {
  const { cost, rate } = calcCostRate(entry, 5, 0, successRate)
  if (1 <= rate) return cost
  return cost + calcRecursiveCost(entry, 5, (1 - successRate - 0.02 - 0.25) / 0.03, successRate + 0.02) * (1 - rate)
}

const calcBuri55MossCost = (entry: RefinementData, successRate = entry.success): number => {
  const { cost, rate } = calcCostRate(entry, 5, 0, successRate)
  if (1 <= rate) return cost
  return cost + calcBuri5MossCost(entry, successRate + 0.02) * (1 - rate)
}
</script>

<div>
  <article>
    <h2>取引所価格</h2>
    <div class="flex flex-wrap gap-4">
      <NumberSelect title="星錬結晶G2" image="Starforge Crystal 2" options={star2TradePrice} bind:value={star2Price} />
      <NumberSelect title="クラフト素材" image="Mystery Metal" options={craftTradePrice} bind:value={craftPrice} />
      <NumberSelect title="ブーリーの機械片" image="Buri Mech Shard" options={buriTradePrice} bind:value={buriPrice} />
      <NumberSelect title="モスの機械片" image="Moss Mech Shard" options={mossTradePrice} bind:value={mossPrice} />
    </div>
  </article>

  <article class="flex flex-wrap gap-4">
    <fieldset>
      <h2>強化対象</h2>
      <label>
        <input type="radio" id="weapon" name="isWeapon" value={true} bind:group={isWeapon} />
        武器
      </label>
      <label>
        <input type="radio" id="gear" name="isWeapon" value={false} bind:group={isWeapon} />
        防具
      </label>
    </fieldset>
    <div class="flex flex-wrap gap-4">
      <NumberSelect title="目標レベル" options={weaponRefinementTable.map(t => t.level)} bind:value={targetLevel} />
    </div>
  </article>

	<article>
		<h2>結果</h2>
    <table class="results-table">
      <thead>
        <tr><th>繰り返しパターン</th><th>ルーノ期待値</th></tr>
      </thead>
      <tbody>
        {#snippet tr(title: string, value: number)}
          <tr><td>{title}</td><td class={`!text-center ${value === minimumCost ? '!font-bold underline' : ''}`}>{Number(value.toFixed(0)).toLocaleString('ja-JP')}</td></tr>            
        {/snippet}
        {@render tr("通常", results.regular)}
        {@render tr("ブーリー1個", results.buri1)}
        {@render tr("ブーリー2個", results.buri2)}
        {@render tr("ブーリー3個", results.buri3)}
        {@render tr("ブーリー4個", results.buri4)}
        {@render tr("ブーリー5個", results.buri5)}
        <tr><td class="th">特殊パターン</td><td class="th"></td></tr>
        {@render tr("通常n回→75%でブーリー5個", results.regularAndBuri)}
        {@render tr("通常1回→ブーリー5個", results.regular1AndBuri)}
        {@render tr("通常1回→ブーリー1個→2個→3個→4個→5個", results.regularburi12345)}
        {@render tr("ブーリー5個→4個→3個→2個→1個→通常", results.buri54321Regular)}
        <tr><td class="th">モスあり</td><td class="th"></td></tr>
        {@render tr("ブーリー5個/モス1個", results.buri5Moss1)}
        {@render tr("ブーリー5個/モス100%", results.allMoss)}
        {@render tr("通常1回→ブーリー5個/モス100%", results.regular1AndMoss)}
        {@render tr("ブーリー5個1回→ブーリー5個/モス100%", results.buri5AndMoss)}
        {@render tr("ブーリー5個2回→ブーリー5個/モス100%", results.buri55AndMoss)}
      </tbody>
    </table>
	</article>

  <article>
    <h2>考察</h2>
    <p>基本的に、ブーリー5個入れて強化が効率良さそう。</p>
    <p>モスは、ブーリー5個で1-2回失敗した後、100%まで入れるといいかも。</p>
  </article>
</div>

<style>
  fieldset {
    width: fit-content;
    margin-bottom: 0;
  }
  td.th {
    font-weight: bold;
    border-top: 0.1875rem solid var(--pico-table-border-color);
    border-bottom-width: 0.1875rem;
  }
</style>
