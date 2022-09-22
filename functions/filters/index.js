import { borderDetect } from "./borderDetect.js";
import { logarimitFilter } from "./logatimic.js";
import { potenciaFilter } from "./potencia.js";
import { localHistogramFilter, globalHistogramFilter } from "./histogram.js";
import { highBoostFilter } from "./highBoost.js";

import {
  medianSmoothingFilter,
  averageSmoothingFilter,
} from "./spatialFilter.js";
import { bitplaneSlicing } from "./bitSlicing.js";
import { negativergb } from "./negative.js";

export {
  borderDetect,
  localHistogramFilter,
  averageSmoothingFilter,
  bitplaneSlicing,
  globalHistogramFilter,
  highBoostFilter,
  logarimitFilter,
  medianSmoothingFilter,
  negativergb,
  potenciaFilter,
};
