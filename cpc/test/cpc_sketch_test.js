
// Licensed to the Apache Software Foundation (ASF) under one
// or more contributor license agreements.  See the NOTICE file
// distributed with this work for additional information
// regarding copyright ownership.  The ASF licenses this file
// to you under the Apache License, Version 2.0 (the
// "License"); you may not use this file except in compliance
// with the License.  You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied.  See the License for the
// specific language governing permissions and limitations
// under the License.

const { generate_udf_test, generate_udaf_test } = unit_test_utils;

// using defaults

generate_udaf_test("cpc_sketch_agg_string", {
  input_columns: [`str`],
  input_rows: `SELECT * FROM UNNEST([CAST(NULL AS STRING), CAST(NULL AS STRING), CAST(NULL AS STRING)]) AS str`,
  expected_output: null
});

generate_udaf_test("cpc_sketch_agg_int64", {
  input_columns: [`value`],
  input_rows: `SELECT * FROM UNNEST([NULL, NULL, NULL]) AS value`,
  expected_output: null
});

generate_udaf_test("cpc_sketch_agg_union", {
  input_columns: [`sketch`],
  input_rows: `SELECT * FROM UNNEST([CAST(NULL AS BYTES), CAST(NULL AS BYTES), CAST(NULL AS BYTES)]) AS sketch`,
  expected_output: null
});

const cpc_1 = `FROM_BASE64('CAEQCwAOzJMDAAAAAgAAAAAAAAAA+p9AiIAEKIABCEC+FRhuAwAAAA==')`;

generate_udaf_test("cpc_sketch_agg_string", {
  input_columns: [`str`],
  input_rows: `SELECT * FROM UNNEST(['a', 'b', 'c']) AS str`,
  expected_output: cpc_1
});

const cpc_2 = `FROM_BASE64('CAEQCwAOzJMDAAAAAgAAAAAAAADA/J9AVTYhEhABCEC+rcvjSAAAAA==')`;

generate_udaf_test("cpc_sketch_agg_string", {
  input_columns: [`str`],
  input_rows: `SELECT * FROM UNNEST(['c', 'd', 'e']) AS str`,
  expected_output: cpc_2
});

generate_udf_test("cpc_sketch_union", [{
  inputs: [ `CAST(NULL AS BYTES)`, `CAST(NULL AS BYTES)` ],
  expected_output: null
}]);

// this one is slightly different form cpc_1: merged is true, KXP and HIP are invalid
const cpc_1_merged = `FROM_BASE64('BAEQCwAKzJMDAAAAAgAAAL4VGG4DAAAA')`;

generate_udf_test("cpc_sketch_union", [{
  inputs: [ cpc_1, `CAST(NULL AS BYTES)` ],
  expected_output: cpc_1_merged
}]);

// this one is slightly different form cpc_2: merged is true, KXP and HIP are invalid
const cpc_2_merged = `FROM_BASE64('BAEQCwAKzJMDAAAAAgAAAL6ty+NIAAAA')`;

generate_udf_test("cpc_sketch_union", [{
  inputs: [ `CAST(NULL AS BYTES)`, cpc_2 ],
  expected_output: cpc_2_merged
}]);

const cpc_union_1 = `FROM_BASE64('BAEQCwAKzJMFAAAAAgAAAHwTuG5g27UF')`;

generate_udf_test("cpc_sketch_union", [{
  inputs: [ cpc_1, cpc_2 ],
  expected_output: cpc_union_1
}]);

generate_udf_test("cpc_sketch_get_estimate", [{
  inputs: [ `CAST(NULL AS BYTES)` ],
  expected_output: null
}]);

generate_udf_test("cpc_sketch_get_estimate", [{
  inputs: [ cpc_union_1 ],
  expected_output: 5.00162840932184
}]);

generate_udf_test("cpc_sketch_to_string", [{
  inputs: [ `CAST(NULL AS BYTES)` ],
  expected_output: null
}]);

generate_udf_test("cpc_sketch_to_string", [{
  inputs: [ cpc_union_1 ],
  expected_output: `'''### CPC sketch summary:
   lg_k           : 11
   seed hash      : 93cc
   C              : 5
   flavor         : 1
   merged         : true
   interesting col: 0
   table entries  : 5
   window         : not allocated
### End sketch summary
'''`
}]);

const cpc_3 = `FROM_BASE64('CgEQCwAezJMAFQAAJgAAAAAAACDomYJAR9CpOgRcw0AMAAAAJgEAALFuuPtTekqPjdsIcV1W8eGS92h1HRSv4ygo4NXXjivr+bTu1EUfnE79HYVQ6agvNz9+Hagp1a4EHx+EY+k2p6o6x2pk0Sliv3NPNigUgRBaQwl3C2j+uFkMGsx4OdrqcdlE53p48+Coa3LN7ZYop6ESxxYUJi83zSxi23wia67Sy/uMTVt3ZCZHMeneexhsvD1oUKDzqjs50zwlZLgrVZhOWEYaR6r92giX4haa9Dw7H3L39AmOVe7RdTL2jD2NDsMWWRKpMT01VCGLWO+NsLO9KudSPM4YwuzWcT8UBng9o84WNabrHqWLWJ/MPLn13rCcdTFTg8V0u3gWDQsbucasWB7U2AWe4CFvqw5ZnlhhMIxuPNOJuW4f6t5ocuJg1jB7LaLfnxelVtFUjKbikMrBq3c8pOHTpGE/OmndNBp9FqHSwVc/q6gjXHU0v/DoQurpoiJjQ61H0ZtUTEqZJDORhIghzFAis2GlfPaAaaHRoo6mTf+shveH9wLBXKuvnJxj364eRQkIWt52KWiTdFPg0Vqsw12dgYbQAEh+LWhua1mXQfrp26qm5M4FbyWSqn0NCNs6vrGxU+Cjx1N4b1itMskgYsbOX0d1mQZZxMKJkulxFYpdNm4x4HLCQDGDqoTtIGP0YA50GRm9ZGoYFU7X2x7v5kzTDRS9MLkinJt4TPYKB4nEi7GcJLlsBG/ImsWEYk914/7gbOSLJ9/uQuLNuc9Yy1wyu2QM8y3JpBQcTtRFbpfMK1mLA8nZaOD4cibYExeNtE09ryk9hFifBWyT26eUizwj8276cEN4HAw3tv26epOdPPXYo5flUui6W1IeO/ErfCEQ2dn2QnOz67WOPqwp78xQ6gpETsTk9AMEMss9Zw8agBnk0gOexr5Nch6b9/S2rt79QIYzrq/KWHZO9McrKCc2U2+MuFda5WJI5CVT6MYUx8csdoLbw4Ma8jSC9SKgrlSOt6INUO28rR9cKgm1B23v+CRm7kT0cUHn1HnY2K5ZuNc5Zwsp2T52fRTdHayhU0qGSpTxeWxKyzRtOAO2PL64uT7Sq6949FDP15Z996snmBgDm/JxVXJ9PgZbmc1pLyVu5V3JYCz6ZDrrmBECYWs/dLLL1bAX9wy5al0zymQNAjFPvkh5UtcPkncGhr10qT7rRidBdDn73d1o7K1dMDBtLilJqq8WUr9XvcKJkG9Xa0aU3HkAUx4uA68d1jgQRyYzeVW3L3vlQSOYBpMNmeKJAT6buzTsCCdWjoaeIV1D1yPmWcST4i4O4HiOyN5RdOgIKaKYDdvalUUrRCVw42T2uVTq03kZDWyp4JqtFSLVFvYqBmFPIdadC1oEFu3e8aCGwkvAooOMwGq4BZyux3U6biAdp8zXooyaCbDhFS4cyQXYhpQmXn6vL00Zdr6Pka4rqYGe9amHOeKaGNU5uIqkcTofSpO0MiEdbUTs51vBMZuKeo6cgbWqUKBcF0mvTZVCdrGW83RZvm5/BQw144KEOhuXDce4W1IE8hM7QbGUzNIOryxSRHYFCQFiWG+HIS+AYjQrc6UzN1GuoDHw0TsHANo11tB70dkzRAsZXTTYwIWGzXp5ueQdoLyIJpgvy46M2/lRbFkCEVmq2cILAAAAAA==')`;

generate_udaf_test("cpc_sketch_agg_int64", {
  input_columns: [`value`],
  input_rows: `SELECT * FROM UNNEST(GENERATE_ARRAY(1, 10000, 1)) AS value`,
  expected_output: cpc_3
});

const cpc_4 = `FROM_BASE64('CgEQCwAezJPwFAAAHQAAAAAAAJBRgoJADAspKmFqw0AJAAAAIwEAAI+bD2HczIQh3KVdHCIUeTRCZ4YUVruJS2nR1MIzqGU7kEVDrL2y6DiaK2WFk3WzpbIX5B56qs4GOZIth55op49CDCiv3ii6tBe57pogsS4YxBOjLFanxXrQFNv7cHzraiAxsrpvJpH7cbNfKQsQFnqy2jZCXnazVq2rUqWvIirYQV2n9TcjfWf7yvFMwbr3yL5WXQejcUVuqE93i6DgYFqdTZ5SVJ7VrYzKSuWOEvYi0cdjqsIBMW1b2PBkkIN0hm2k/u6ZU4NpkHNCFtcLD8Ib+EzED7uGwJU9sTIrZYxLqxzizlSPdULMU5Qweplci6cJM+tLN5i4iVSnRP7RUx3u9PmUYWe4euLcOvmg9apJ5kGdOoaGFLIKCwlsSClYwbOjiv6EDZpP9tnyWYT5FAWfcyxgEdWQTT47H84UunokQKDLt9SqBiLvFqt99qAtDfVYuaZruuOaEFx/Gs79IIU9COroao9ya5JqozOzzmUhw1AZaNpst6rWeEFdVPZNA+nE/mY25iy7GgYrhJbRJG+PVazNbXnsam3UUnXPjLWP+wBKa/gtq12J9RtIaUGPjsMaW0ot3hu+r2L+9pI6MhphIetLJ+VGENYnZk0+N48MLnqhMyNYFnfVFyshjgErWJ+i2+aoZTBalBCmsHX2y6OjaafqNFxz92Enzc8iUbpFPywMOIytsClZZJjZQko9VjcMrlBFoGpi5UVNPOXudgeahrqTcDezhRjt5ZlNK7PAVW9qwrbB7DVdSqd3CrldSysqzypwpMmdzrvzo9SwXpvy3NRr0tlW2E0L6eE9pFaPfKDFlL1yAULXbZu7G5ZDJjZRXLANnAGabkUQJmvsKQNvrs+1JI8sjs2tlRJdK3ssrj18C/WVDA5X40ItwqKyuPceX4HqkspCcZwUeuz4FuS1XQhQsXC/xW0pF2yiWr7cfDugF9HdVdFuqAyiSCXuaLjyws7yODlnVQyxIucny/6oVpnywes0VUBEsFBl7G2F4lFYnXGvD4IrEzLL4cSOtNS9dIMIcbBdATVqsVh/oUrYgRLNtoItkXWWKLid5xtRFNkteHwla6VLZOMQIhZFe1p2Mw+LupwmPJ5IKEoxuTUiSxYbGVWAgpY6qElZfXIRT6cfnkrSp5CUewoCjDjLVdHL7MSmPHCry9BSvTmsXbWqXg/HcrtraEIyaZImDtFiKuIpMJ8uOh6LNBPSdhf18QNbmnmxCBN2smRwu/nY5SrLeTeaWbrqXMcMKmPTmzkwKNEOSU+34SBqxfK5cgzjxU53cd86Nu1MBaE8HeZtUwqzx6uV4hjKxlbVg3l31LfkOg83mUxmqIQJYKe6kgl6OnocckpJTHD5MeXWXfBULofBFMNeDZAyFpun1jVNQVp7jLuizeVgXRadzMAf41DxwtEwlismwxQZr94VPOJU1jyHoVXYunssDMrOFAYEUs6qG+WOnhG7sdSjRtsKZATmqNow9AjgSjRmQZptgBsJqcvNxvGwSExY4Hm2sPCVDXZplZC5Ul40hr7uhdDgZQV+zqNIuUNXkBSwBQAAAF9rsfikTMLR68ZyT3FBNtKgfpPiVIaunsFHnbRDOxr1lrBVBg==')`;

generate_udaf_test("cpc_sketch_agg_int64", {
  input_columns: [`value`],
  input_rows: `SELECT * FROM UNNEST(GENERATE_ARRAY(100000, 110000, 1)) AS value`,
  expected_output: cpc_4
});

const cpc_union_2 = `FROM_BASE64('BgEQCwAazJP3HAAALQAAAA4AAAAmAQAAJ0NIHW+tM67tHUnwsPbKORpUC7EyQ5MsfHRXN0Q+6Z1Ubi/XQo58XeNUTkXixXesrY8tQlBMsrOz4j2doKYCj80DxdXTVA9ELykthMswmdJ2l9VpOHILjhm9pTrjBXDMMYzFMte5KjrQinVsZd4c1+Mv9upeu/k0i+J+LTgwFYXCX+1Sxok6Vi4mC7U4SVfGVlIMtF3hNGtEJ0AdnaQLZ1yahu1IIzRY84ThaGC5Pb7YSds2cquigRVysFpDprMjUy+24mlCu21QZEtlV5pt513c2PPIY1s45m+7rZIjceRDqXMvvlxLvl2+5LA1uzUJc1dFEvKhbuedJPWzsNXdyrDMounWGNqiM4hj4xwtT+emTuQQO5adOFmTCsCzhqpCGGpoKGmx9kLQGE20/k505of0vy1JF9YYgsELEiPzU02PN9WKQxSjf4AIZE/kqWYlFWVUtUCAGo1tRzWZt8F7TzPkPM0U6DAxVC+hKEHSwjr2EjO3OiTB2Kpyth6vD15ssNBW4GU1hq7KijxiGAThAeT1kAVEWyliwVMUyS279atRBOriie54PsiH3CLhNkHLWVh1j8udzqwLfBYPA5g8vZn/8NMZXGiU4zPkcyW6YrjSdlvEBO4LB61uoYKWNpnJLyGqVwVPugWaK2zGYNnyuNa6qSmLDQi0AbYum9T5kr1BBnmzorEKyS+Z6UnEcVmOQqIkrGox3TjsjqaEs2dRZ9uBQLEh7tLXIwShZrY+tOKaLsoqqkUb4H4SUUNy02MJaVkeH0RdjzCcyk5viO0659JjUvBSTRVs5YOm19QQROy3s2snWQXSCsSVa00PHbyhJMnGL5wHZquhLOgHy5uTvKRBqKElRM8dF9qXmnUW6W4xl3k7vOowmHzMLNdr6KFOgfaiG7AY7qeYo6X49MDmy6vV8pWvORSLwSQm2wZyXnE57LfsbuguN7XaXagdqQy9zCPkNyfFwzIdand7WDvCM9Zdu6+1Vdm5dHiF25SqZEp3UWrW2QDabq6tjwmei0XUxlxS8yvxTNJDMqU9Wgfb2LEfD/do/eY8kDyLramrbWkVz8E06oTrOjvcFedI5vVkOLM8Uor+khz58haqgeGmsjis2fmZFD1KtUVEuOZtHsUGZHXsTUGWHO4f7ryO7Arqz1Ta1VGApEZamd29OFE6d6zlgRKVUCyArpBwGMSVo8Vg+dIpbXdgoNQSDiwt/FCMZ9iMehs7kZ7WU6BOKseX+xQ8t3d/9LzQjk2drY/7Qi+UH00vCGpDuhUR1/fMapPEZIiRK4Ni8LkmTcV8Fq+Dl92Quidu1r6qkK+o27FyNz8e7HCeOCiictC5yR4nNDTWQciZeeTloYgn8C+lDBhymRXRuall5AUjpmuoChjOtLeniktF6RXJx7NMCY366Tz210bZ7WRmklpDxrVhjT+4MO4exFCqYUi+RqWe6RlBkL0iGNcg6VlmVzYZDjbKRFIwfEsbjkKxjhJVmMoTZ+owHXNFGIRZKgy39BgxO0iQFCwO95bgS87dpJPlTAwumw/CpAHtctgq5RhazAevcWoPADpaEkUwYBUAy79mqNmglKA91spcj8G2M3tzc21AfZW84i1VpyMuv64dKC5jX1P7geOzb1mSARtC6ZKtqbABAAA=')`;

generate_udaf_test("cpc_sketch_agg_union", {
  input_columns: [`sketch`],
  input_rows: `SELECT * FROM UNNEST([${cpc_3}, ${cpc_4}]) AS sketch`,
  expected_output: cpc_union_2
});

generate_udf_test("cpc_sketch_get_estimate_and_bounds", [{
  inputs: [ `CAST(NULL AS BYTES)`, 3 ],
  expected_output: null
}]);

generate_udf_test("cpc_sketch_get_estimate_and_bounds", [{
  inputs: [ cpc_union_2, 3 ],
  expected_output: `STRUCT(20000.731632174215 AS estimate, 19103.49112120969 AS lower_bound, 20932 AS upper_bound)`
}]);


// using full signatures

const cpc_10_111_1 = `FROM_BASE64('CAEQCgAOjNMDAAAAAgAAAAAAAAAA+I9AkAIOUAACCEApL1e3AAAAAA==')`;

generate_udaf_test("cpc_sketch_agg_string_lgk_seed", {
  input_columns: [`str`, 'STRUCT(10 AS lgk, 111 AS seed) NOT AGGREGATE'],
  input_rows: `SELECT * FROM UNNEST(['a', 'b', 'c']) AS str`,
  expected_output: cpc_10_111_1
});

const cpc_10_111_2 = `FROM_BASE64('CAEQCgAOjNMDAAAAAgAAAAAAAACA+49AHHqBFCABCEDnccXLCQAAAA==')`;

generate_udaf_test("cpc_sketch_agg_string_lgk_seed", {
  input_columns: [`str`, 'STRUCT(10 AS lgk, 111 AS seed) NOT AGGREGATE'],
  input_rows: `SELECT * FROM UNNEST(['c', 'd', 'e']) AS str`,
  expected_output: cpc_10_111_2
});

const cpc_union_10_111_1 = `FROM_BASE64('BAEQCgAKjNMFAAAAAgAAAIfHruR2mxwA')`;

generate_udf_test("cpc_sketch_union_lgk_seed", [{
  inputs: [ cpc_10_111_1, cpc_10_111_2, 10, 111 ],
  expected_output: cpc_union_10_111_1
}]);

generate_udf_test("cpc_sketch_get_estimate_seed", [{
  inputs: [ cpc_union_10_111_1, 111 ],
  expected_output: 5.003258518185566
}]);

generate_udf_test("cpc_sketch_to_string_seed", [{
  inputs: [ cpc_union_10_111_1, 111 ],
  expected_output: `'''### CPC sketch summary:
   lg_k           : 10
   seed hash      : d38c
   C              : 5
   flavor         : 1
   merged         : true
   interesting col: 0
   table entries  : 5
   window         : not allocated
### End sketch summary
'''`
}]);

const cpc_10_111_3 = `FROM_BASE64('CgEQCgAejNObDgAAEwAAAAAAAODTamJAEuxQsYzzw0AHAAAAkwAAAItbgcaBtLoCnGenKGkCETFyOS7wvKi2gMwNzDqqRZ/mxry4yzw35mVS/KqEzafPfdfa8cjkrnqKux4nnm/ltHoIYSSxQBrnJnF0nYvhGpSt2Kp7XVBocExL1HRWxmbzSsURbgKE2j3kvk7a0cp33F5fskKIRnam+oovpGrsDvAITGp0QhFm72qi3Cwfu6bWwX727GC96atVa1q4EQuKH90kW+QA8PoNyJkDMeW9W5NsZ0ivKwiIW43R1x0aJkJ66UvCCrRBzGvIqml9M02+vmq6aiQCi8uMnpFsXLPku+E4Wh6iI/eERBdqvcdKkkcmUNZXe5Edqp5jfrW+riW6lZYhByM3Nwmq5RqJE3fdGMQyXialhnb3IZZWhiotTGUIl6lz7XcxMGaNFWAhPM4sVW/t4+BtUh72Hy3J9KhK3ZjtcYRMda7zzVS5AmTuNc9N6BiIM2XKyzVxQdpBEHSx3qeWYRqmVV+V8ZBuoOnE12Qe7xwdOYF6taxaL5tVnlxKj8QWgRZSPM9tVbNfYGRlRsuC1akOcYGMExSx3n7aC8M0TxF4jX0xhIoEeBTwcgIM2IENzFLQ1lUqwn4QvfR4NpZFWG7RIZYhAlap3BfXD2y4FK8loK3y5B7MdDNUj4sQ7byZG8/PFVIZsjx3kkgbtIl7JB4hVrDXvtzoZE4aKyWnpCA0krOh8R6KqPL2MGUo0s3oj2CEUGKsuyqkp5RPlyS6aEZ20ymARFDQAkypc4Xldfag9JcWXBCPFHU5Br7AZEgcy9NHDtwYjAsAAJYck0x87eE8f9bOVIbz2yM8Ic83vIhPAwAAAAA=')`;

generate_udaf_test("cpc_sketch_agg_int64_lgk_seed", {
  input_columns: [`value`, 'STRUCT(10 AS lgk, 111 AS seed) NOT AGGREGATE'],
  input_rows: `SELECT * FROM UNNEST(GENERATE_ARRAY(1, 10000, 1)) AS value`,
  expected_output: cpc_10_111_3
});

const cpc_10_111_4 = `FROM_BASE64('CgEQCgAejNNPDgAAHgAAAAAAAABC02JADI03YoJjw0AJAAAAjgAAABaSEL4NyUXqagO6ZjJQMLDbybVyp3cuDaOSvCpt0YILk8N6gxzTVqX2pxUUvN5bbkJJ5x4uerdUH8j5aF/Jl1237GFnlrjJNmjrd7XaETjbRJKhSwO8Ep6tHh5Z1ZGnth0tsMOJR+xVyxlrMAxk6pepY0gYJbPTfKRXdIQYIsRjSPrBZT7FCuQIgQvU7DEpGef39md7YskoD6KwlN6X28aBbtQmYc/X8eMo5GiATtYsox7KxCCNWg/HgO+BGjbmrQ0ahAXporzKhq89cCSsX9lAkWr1NbrEUs8U91SLcwUaGuW6QhbZjtR6VYJH1jXbJTg2I2xyuW9qvpKio9wvZakzDFMPVdTmMkK6CqRWKtq3Hw2z2rIiMaLSsUWhL0fIYzC67RavIVnsPFpF5ksbZ5L1QkdS6Oo26VzoXCOqdhnlkNkdxTDYgu7xlO7i6zoCxC2wLTcFFhekzaixer5ZW3ZCEi9PO0A7zMiy7KoqB61J7GTbhwOtd+KmOyN52xVRL3mtJIAmZbKtJrezFxi3ferqjUqYDcy0aq+XIZfVegbsOQJnIIzjXfUEU0+e9af1FS3zenkFpaUb2hv3I0PMjLyKS2BkvBAzjBL9BF1YmB4Nao8FT6ShhuwK2hho1Eg6d2KTkH0BZ6EiSDJK80g1hpgjE6E48iZmm8tWdJ9tAjSfeN6BDtQwqcsRSBHNwUs9Gjv0aAuE2bS/9rsSso7Jicr5chZZ8OpVUTyAuGQ1VjUZhhI7VQAAAACoZrnLd7fI597BeJPCV+zqzr52eC91Hm28JQinq6V2mwAAAAA=')`;

generate_udaf_test("cpc_sketch_agg_int64_lgk_seed", {
  input_columns: [`value`, 'STRUCT(10 AS lgk, 111 AS seed) NOT AGGREGATE'],
  input_rows: `SELECT * FROM UNNEST(GENERATE_ARRAY(100000, 110000, 1)) AS value`,
  expected_output: cpc_10_111_4
});

const cpc_union_10_111_2 = `FROM_BASE64('BgEQCgEajNN5EgAAGAAAAAgAAACTAAAAsyPBi2WqQwBo3cJcFgbmGiz9aHOsGDpMSteKVlRvU6162XVKI0f0LpxTazu+ea3YURXbk+aIY3TSqUXnAjdkt7oBFjUCGx+2XtCjlfPZvB3D5FJnVQ7BqS6n1RW9InJ/FrwUUWMIifVqfNZHP9u3Q5qbY4Egsj3biopdPsd9oy3hhuNyv2nHpkkvTN0paS/a7Q1JWOkCI+w66PxpV0PHksJezDbNXSvyYXtIT11nFTFhHE/t2OToKFQYsOibD8lzf9x7USK1rIOhQs1Jl3T1sKFmJhOYr8byJimRUJN+6qsi95LakyxlMZThUVxoZWpIZX0z7id2FFp5IFNxJGsObiPKq+NLdIAGU9LUx9OFuW5Doog9ZnLpAEwMcmL2Qu/IUFqoDIGbNZAeMxFbqTOrq5FMdmj6aJ2ER3aLrtwDM6JGnSQtq0wiOMuBWky+kySuHEpzMX21xC0jh7TiWj4wBivWOuTpvhtbN1hqfdxZ3AcOsFbkoGMrdkuKo2EqDBHA0XFX14PIDbYOakFHMCxLr6FIS8N1OP38ideoVT6dFN8yalgNyEy4hthqCfSlnJisgSyyCMeWb1s4q3WGXBPbawekrqghFwuhDF8PqPhaoxGh5WDyG5NT9l3OGLvwzu14mxZ4L39hA9J0np4VO2KIYorHtj7KkOYWyJsLk2vwrC5ikGMBscav9MHk9Yp5DLaUDA7tWpLcQRUUdtcTU9RmeKlhzgMhw2a0uMMt9Nl0ZkuKF9/FM1yuxUDgc/wu+BVC+WINfe/aMAAAAAAAyYUcu1RrV7H2zLZm5gyIxkS3dNzroq7/EjONFQAAAAA=')`;

generate_udaf_test("cpc_sketch_agg_union_lgk_seed", {
  input_columns: [`sketch`, 'STRUCT(10 AS lgk, 111 AS seed) NOT AGGREGATE'],
  input_rows: `SELECT * FROM UNNEST([${cpc_10_111_3}, ${cpc_10_111_4}]) AS sketch`,
  expected_output: cpc_union_10_111_2
});

generate_udf_test("cpc_sketch_get_estimate_and_bounds_seed", [{
  inputs: [ cpc_union_10_111_2, 3, 111 ],
  expected_output: `STRUCT(19967.703650307845 AS estimate, 18707.573211045103 AS lower_bound, 21304 AS upper_bound)`
}]);
