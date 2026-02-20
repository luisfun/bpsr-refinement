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
    regularAndBuri: calcBasicAndBuriCost(entry),
    regular1AndBuri: calcBasic1AndBuriCost(entry),
  }
})
let minimumCost = $derived(Math.min(...Object.values(results))) 

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
        <tr><th>パターン</th><th>ルーノ期待値</th></tr>
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
        {@render tr("ブーリー5個/モス1個", results.buri5Moss1)}
        {@render tr("ブーリー5個/モス100%", results.allMoss)}
        {@render tr("通常n⇒75%でブーリー5個", results.regularAndBuri)}
        {@render tr("通常1⇒ブーリー5個", results.regular1AndBuri)}
      </tbody>
    </table>
	</article>
</div>

<style>
  fieldset {
    width: fit-content;
    margin-bottom: 0;
  }
</style>
