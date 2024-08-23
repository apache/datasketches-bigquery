select t.cpc_sketch_get_estimate(
  t.cpc_sketch_scalar_union(
    (select t.cpc_sketch_agg_string(str, struct<int, int>(null, null)) from unnest(["a", "b", "c"]) as str),
    (select t.cpc_sketch_agg_string(str, struct<int, int>(null, null)) from unnest(["c", "d", "e"]) as str),
    null,
    null
  ),
  null
);

create or replace table t.cpc_sketch(sketch bytes);

insert into t.cpc_sketch
(select t.cpc_sketch_agg_string(cast(value as string), struct<int, int>(null, null)) from unnest(GENERATE_ARRAY(1, 10000, 1)) as value);
insert into t.cpc_sketch
(select t.cpc_sketch_agg_string(cast(value as string), struct<int, int>(null, null)) from unnest(GENERATE_ARRAY(100000, 110000, 1)) as value);

select t.cpc_sketch_to_string(
  t.cpc_sketch_agg_union(sketch, struct<int, int>(null, null)),
  null
) from t.cpc_sketch;

drop table t.cpc_sketch;
