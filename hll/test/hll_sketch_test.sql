select t.hll_sketch_get_estimate(t.hll_sketch_agg_string(s, struct<int, string>(null, null))) from unnest(["a", "b", "c"]) as s;

select t.hll_sketch_get_estimate(
  t.hll_sketch_scalar_union(
    (select t.hll_sketch_agg_string(str, struct<int, string>(10, "HLL_8")) from unnest(["a", "b", "c"]) as str),
    (select t.hll_sketch_agg_string(str, struct<int, string>(10, "HLL_8")) from unnest(["c", "d", "e"]) as str),
    10,
    "HLL_8"
  )
);

create or replace table t.hll_sketch(sketch bytes);

insert into t.hll_sketch
(select t.hll_sketch_agg_string(cast(value as string), struct<int, string>(null, null)) from unnest(GENERATE_ARRAY(1, 10000, 1)) as value);
insert into t.hll_sketch
(select t.hll_sketch_agg_string(cast(value as string), struct<int, string>(null, null)) from unnest(GENERATE_ARRAY(100000, 110000, 1)) as value);

select t.hll_sketch_to_string(
  t.hll_sketch_agg_union(sketch, struct<int, string>(null, null))
) from t.hll_sketch;

drop table t.hll_sketch;
