import http from "k6/http";
import { sleep } from "k6";

export const options = {
  stages: [
    { duration: "15s", target: 100 }, // ramp up
    { duration: "15s", target: 1000 }, // mid
    { duration: "15s", target: 500 }, // ramp down
  ],
  // scenarios: {
  //   constant_request_rate: {
  //     executor: "constant-arrival-rate",
  //     rate: 1000,
  //     timeUnit: "1s",
  //     duration: "30s",
  //     preAllocatedVUs: 100,
  //     maxVUs: 10000,
  //   },
  // },
  // scenarios: {
  //   constant_request_rate: {
  //     executor: "constant-arrival-rate",
  //     rate: 1000,
  //     timeUnit: "1s", // 1000 iterations per second, i.e. 1000 RPS
  //     duration: "30s",
  //     preAllocatedVUs: 10, // how large the initial pool of VUs would be
  //     maxVUs: 10000, // if the preAllocatedVUs are not enough, we can initialize more
  //   },
  // },
};

export default function () {
  // http.get("http://localhost:3000/api/reviews/?product_id=16");
  http.get("http://localhost:3000/api/reviews/meta/?product_id=16");
  sleep(1);
}
