create or replace table t.kll_sketch(sketch bytes);

insert into t.kll_sketch
(select t.kll_sketch_float_build(value, null) from unnest([1,2,3,4,5,6,7,8,9,10]) as value);
insert into t.kll_sketch
(select t.kll_sketch_float_build(value, null) from unnest([11,12,13,14,15,16,17,18,19,20]) as value);

# expected 0.5
select t.kll_sketch_float_get_rank(t.kll_sketch_float_merge(sketch, null), 10, true) from t.kll_sketch;

# expected 10
select t.kll_sketch_float_get_quantile(t.kll_sketch_float_merge(sketch, null), 0.5, true) from t.kll_sketch;

drop table t.kll_sketch;

select t.kll_sketch_float_kolmogorov_smirnov(
  (select t.kll_sketch_float_build(value, null) from unnest([1,2,3,4,5,6,7,8,9,10]) as value),
  (select t.kll_sketch_float_build(value, null) from unnest([1,2,3,4,5,6,7,8,9,10]) as value),
  0.05
);

select t.kll_sketch_float_kolmogorov_smirnov(
  (select t.kll_sketch_float_build(value, null) from unnest([1,2,3,4,5,6,7,8,9,10]) as value),
  (select t.kll_sketch_float_build(value, null) from unnest([11,12,13,14,15,16,17,18,19,20]) as value),
  0.05
);
