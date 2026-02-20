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
    allBuri: calcRecursiveCost(entry, 5, 0),
    allMoss: calcRecursiveCost(entry, 5, (1 - entry.success - 0.25) / 0.03), // 成功率が100%になるまでモスを投入
    regularAndBuri: calcBasicAndBuriCost(entry),
    regular1AndBuri: calcBasic1AndBuriCost(entry),
  }
})

const calcRecursiveCost = (entry: RefinementData, buri: number, moss: number, successRate = entry.success): number => {
  // 関数にしようとするとエラーになる
  const cost = entry.star * star2Price + entry.craft * craftPrice + buri * buriPrice + moss * mossPrice
  const rate = Math.round(Math.min(successRate + buri * 0.05 + moss * 0.03, 1) * 100) / 100
  if (1 <= rate) return cost
  return cost + calcRecursiveCost(entry, buri, moss, successRate + 0.02) * (1 - rate)
}

const calcBasicAndBuriCost = (entry: RefinementData, successRate = entry.success): number => {
  const buri = successRate < 0.75 ? 0 : 5
  const moss = 0
  const cost = entry.star * star2Price + entry.craft * craftPrice + buri * buriPrice + moss * mossPrice
  const rate = Math.round(Math.min(successRate + buri * 0.05 + moss * 0.03, 1) * 100) / 100
  if (1 <= rate) return cost
  return cost + calcBasicAndBuriCost(entry, successRate + 0.02) * (1 - rate)
}

const calcBasic1AndBuriCost = (entry: RefinementData, successRate = entry.success): number => {
  const buri = 0
  const moss = 0
  const cost = entry.star * star2Price + entry.craft * craftPrice + buri * buriPrice + moss * mossPrice
  const rate = Math.round(Math.min(successRate + buri * 0.05 + moss * 0.03, 1) * 100) / 100
  if (1 <= rate) return cost
  return cost + calcRecursiveCost(entry, 5, 0, successRate + 0.02) * (1 - rate)
}

$effect(() => {
  console.log('star2Price:', star2Price)
  console.log('craftPrice:', craftPrice)
  console.log('buriPrice:', buriPrice)
  console.log('mossPrice:', mossPrice)
  console.log('isWeapon:', isWeapon)
  console.log('targetLevel:', targetLevel)
  console.log('results:', results)
})
</script>

<div>
	<section>
  	<h2>取引所価格</h2>
		<div>
      <NumberSelect title="星錬結晶G2" options={star2TradePrice} bind:value={star2Price} />
      <NumberSelect title="クラフト素材" options={craftTradePrice} bind:value={craftPrice} />
      <NumberSelect title="ブーリーの機械片" options={buriTradePrice} bind:value={buriPrice} />
      <NumberSelect title="モスの機械片" options={mossTradePrice} bind:value={mossPrice} />
		</div>
	</section>

  <section>
    <h2>強化対象</h2>
    <div class="flex gap-4">
      <label class="flex items-center gap-2 cursor-pointer">
        <input type="radio" name="refinementType" value={true} bind:group={isWeapon} />
        <span>武器</span>
      </label>
      <label class="flex items-center gap-2 cursor-pointer">
        <input type="radio" name="refinementType" value={false} bind:group={isWeapon} />
        <span>防具</span>
      </label>
    </div>
    <NumberSelect title="目標レベル" options={weaponRefinementTable.map(t => t.level)} bind:value={targetLevel} />
  </section>

	<section>
		<h2>結果</h2>
		<div>
      <table class="results-table">
        <thead>
          <tr><th>パターン</th><th>ルーノ期待値</th></tr>
        </thead>
        <tbody>
          {#snippet tr(title: string, value: number)}
            <tr><td>{title}</td><td class="text-center">{Number(value.toFixed(0)).toLocaleString('ja-JP')}</td></tr>            
          {/snippet}
          {@render tr("通常", results.regular)}
          {@render tr("ブーリー", results.allBuri)}
          {@render tr("ブーリー/モス100%", results.allMoss)}
          {@render tr("通常n⇒75%でブーリー", results.regularAndBuri)}
          {@render tr("通常1⇒ブーリー", results.regular1AndBuri)}
        </tbody>
      </table>
		</div>
	</section>
</div>
