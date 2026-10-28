export const DAY = 86400000,
  WEEK = 7 * DAY;
export function monday(time) {
  const d = new Date(time);
  return Date.UTC(
    d.getUTCFullYear(),
    d.getUTCMonth(),
    d.getUTCDate() - ((d.getUTCDay() + 6) % 7),
  );
}
export function snap(time, free = false) {
  return free ? Math.round(time / 60000) * 60000 : monday(time + WEEK / 2);
}
export function overlaps(a, b) {
  return a.start < b.end && b.start < a.end;
}
export function placeTask(state, task, categoryId, row, edge) {
  const category = state.categories.find((c) => c.id === categoryId);
  if (!category) return;
  if (edge) {
    row = edge === "top" ? 0 : category.rows;
    state.tasks
      .filter(
        (t) => t.id !== task.id && t.categoryId === categoryId && t.row >= row,
      )
      .forEach((t) => t.row++);
    category.rows++;
  } else {
    row = Math.max(0, Math.min(category.rows - 1, row));
    if (
      state.tasks.some(
        (t) =>
          t.id !== task.id &&
          t.categoryId === categoryId &&
          t.row === row &&
          overlaps(t, task),
      )
    ) {
      row++;
      state.tasks
        .filter(
          (t) =>
            t.id !== task.id && t.categoryId === categoryId && t.row >= row,
        )
        .forEach((t) => t.row++);
      category.rows++;
    }
  }
  task.categoryId = categoryId;
  task.row = row;
}
export function validate(data) {
  if (
    !data ||
    !Array.isArray(data.categories) ||
    !Array.isArray(data.tasks) ||
    data.categories.length > 100 ||
    data.tasks.length > 5000
  )
    throw Error("项目格式不正确或数据量过大");
  const ids = new Set();
  for (const c of data.categories) {
    if (
      typeof c.id !== "string" ||
      ids.has(c.id) ||
      typeof c.name !== "string" ||
      !Number.isInteger(c.rows) ||
      c.rows < 1 ||
      c.rows > 500
    )
      throw Error("类别数据无效");
    ids.add(c.id);
  }
  const tids = new Set();
  for (const t of data.tasks) {
    const c = data.categories.find((c) => c.id === t.categoryId);
    if (
      !c ||
      typeof t.id !== "string" ||
      tids.has(t.id) ||
      typeof t.title !== "string" ||
      !Number.isFinite(t.start) ||
      !Number.isFinite(t.end) ||
      Math.abs(t.start) > 8e15 ||
      Math.abs(t.end) > 8e15 ||
      t.end <= t.start ||
      !Number.isInteger(t.row) ||
      t.row < 0 ||
      t.row >= c.rows
    )
      throw Error("任务数据无效");
    tids.add(t.id);
  }
  const dates = data.tasks.flatMap((t) => [t.start, t.end]);
  if (
    Math.max(Date.now(), ...dates) - Math.min(Date.now(), ...dates) >
    30 * 366 * DAY
  )
    throw Error("时间范围须位于今天前后合计 30 年内");
  const result = structuredClone(data);
  for (const t of result.tasks) placeTask(result, t, t.categoryId, t.row);
  return result;
}
