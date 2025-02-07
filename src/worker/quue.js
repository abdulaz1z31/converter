import PQueue from "p-queue";

const queue = new PQueue({ concurrency: 4 });

export default queue;
