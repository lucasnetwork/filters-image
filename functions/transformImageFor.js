export function transformImageFor({ data, func, options }) {
  for (var t = 0; t < data.length; t += 4) {
    data[t] = func(data[t], options);
    data[t + 1] = func(data[t + 1], options);
    data[t + 2] = func(data[t + 2], options);
  }
}