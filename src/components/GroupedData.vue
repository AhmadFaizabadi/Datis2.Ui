<template>
	<q-splitter
		v-model="splitterModel"
		style="height: 84vh; width: 98vw"
		:horizontal="$q.screen.lt.md"
	>
		<template v-slot:after>
			<q-tabs
				v-model="tab"
				:vertical="$q.screen.gt.sm"
				outside-arrows
				mobile-arrows
				class="g-light-blue-6 full-width"
				dense
				><q-select
					dense
					v-model="selectedCollection"
					:options="$config.masterGroups"
					label="گروه بندی بر اساس"
				/>
				<q-tab
					v-for="g in groupedData"
					:key="g.id"
					:name="g.id"
					:label="`${g.label}`"
				/>
			</q-tabs>
		</template>

		<template v-slot:before>
		
			<div class="row justify-center q-gutter-lg q-pa-lg" id="theList">
				<q-card
					class="my-card shadow-4 text-white"
					v-for="subg in groupedData[tab]"
					:key="subg.id"
					ref="mine"
				>
					<q-card-section>
						<div>
							<ul>
								<li class="elipsis">
									{{ groupedData[tab]}}
								</li>
								<li>{{ selectedGroup.value.g2.label }}: {{ subg.name }}</li>
								<li>
									<q-btn dense padding="xs" @click="showAll(subg.name)"
										>تعداد واگن: {{ subg.count }}</q-btn
									>
								</li>
							</ul>
						</div>
					</q-card-section>
					<q-card-section>
						<div class="row q-gutter-md">
							<transition appear appear-active-class="animated backInUp slower">
								<table-list-wagons
									ref="makeref"
									:groupOn="selectedGroup.value.g3"
									:filters="[
										`x.${selectedGroup.value.g1.field} === '${tab}'`,
										`x.${selectedGroup.value.g2.field} === '${subg.name}'`,
									]"
									:includeDetails="hasDetail === subg.name"
								/>
							</transition>
						</div>
					</q-card-section>
				</q-card>
			</div> </template
	></q-splitter>
</template>

<script>
import { jSQL } from "src/services/jSQL";
import { mapGetters } from "vuex";
import { SelectableGroups } from "src/services/seirServices";
export default {
	components: {
		ShareData: () => import("./ShareData"),
		// StateSummary: () => import("./StateSummary"),
		TableListWagons: () => import("src/components/TableListWagons.vue"),
	},
	name: "GroupedTable",
	data() {
		return {
			hasDetail: "",
			tab: "",
			splitterModel: 90,
			selectableGroups: Object.freeze(SelectableGroups),
			selectedGroup: SelectableGroups[0],
		};
	},
	computed: {
		...mapGetters("seir", ["DomainSeirData"]),
		groups() {
			const groupFieldName = this.selectedGroup.value.g1.field;
			const result = jSQL
				.qry()
				.from(this.DomainSeirData)
				.groupBy(`x.${groupFieldName}[g]`)
				.count("*[count]")
				.orderBy("x.g")
				.toArray();
			return result;
		},
		subgroupsOfGroup() {
			return function (grp) {
				const tmp = this.DomainSeirData.filter(
					(f) => Object.byString(f, this.selectedGroup.value.g1.field) === grp
				);
				const subg = Array.from(
					new Set(
						tmp.map(
							(m) => `${Object.byString(m, this.selectedGroup.value.g2.field)}`
						)
					)
				);
				const result = subg.map((m) => ({
					name: m,
					count: tmp.reduce(
						(a, c) =>
							(a +=
								Object.byString(c, this.selectedGroup.value.g2.field) === m
									? 1
									: 0),
						0
					),
					distance: Math.max(
						...tmp
							.filter(
								(f) =>
									Object.byString(f, this.selectedGroup.value.g2.field) === m
							)
							.map((x) => x.RemainedMeter)
					),
				}));
				result.sort((a, b) => Math.sign(a.distance - b.distance));
				return result;
			};
		},
	},
	methods: {
		getLevelOneData(){
			return this.DomainSeirData.filter(
				(f) =>
					Object.byString(f, this.selectedGroup.value.g1.field) === this.tab)
		},
		showAll(g2) {
			const filters = {
				[this.selectedGroup.value.g1.label]: this.tab,
				[this.selectedGroup.value.g2.label]: g2,
			};
			const title = Object.entries(filters)
				.map((m) => `${m[0]} ${m[1]}`)
				.join(" - ");
			const wagons = this.DomainSeirData.filter(
				(f) =>
					Object.byString(f, this.selectedGroup.value.g1.field) === this.tab &&
					Object.byString(f, this.selectedGroup.value.g2.field) === g2
			);
			this.$root.$emit("showListWagons", { filters, title, wagons });
		},
		makeref(el) {
			console.log("makeref", el);
		},
		getData() {
			const table = this.$refs.myTable[0].$el.outerHTML;
			const parser = new DOMParser();
			const document = parser.parseFromString(table, "text/html");
			var csv = [];
			var rows = document.querySelectorAll("table tr");

			for (var i = 0; i < rows.length; i++) {
				var row = [],
					cols = rows[i].querySelectorAll("td, th");

				for (var j = 0; j < cols.length; j++)
					row.push(cols[j].textContent.replace(/\s{2,}/g, ""));

				csv.push(row);
			}
			return { title: csv[0], columns: csv[1], data: csv.slice(2) };
		},
	},
};
</script>
<style lang="sass" scoped>
body.body--light
	.my-card
		background: linear-gradient(0deg, $teal-11 0%, $light-blue-9 100%)
		color: black
	th
		background-color: #00bcd4
		color: white
	td
		color: #210303fa
		background-color: #ebf0f1

body.body--dark
	.my-card
		background-color: $blue-grey-14
	th
		background-color: #a0adb9
	td
		background-color: #d3dce891
		color: #e4e4e4
.eta
	position: relative
	left: 3px
	padding: 1px
	font-size: 9px
.my-card
	height: max-content
.my-table
	tr
		cursor: pointer
	th
		white-space: normal
		font-size: smaller
		font-weight: 600

	td
		font-size: small
		max-height: 300px
</style>
