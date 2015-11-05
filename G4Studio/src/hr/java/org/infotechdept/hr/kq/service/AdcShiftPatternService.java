package org.infotechdept.hr.kq.service;

import org.g4studio.common.service.BaseService;
import org.g4studio.core.metatype.Dto;

public interface AdcShiftPatternService extends BaseService {

	public Dto saveAdcShiftPatternItem(Dto pDto);

	public Dto updateAdcShiftPatternItem(Dto pDto);

	public Dto deleteAdcShiftPatternItem(Dto pDto);

	public Dto saveAdcShiftPatternDetailItem(Dto pDto);

	public Dto updateAdcShiftPatternDetailItem(Dto pDto);

	public Dto deleteAdcShiftPatternDetailItem(Dto pDto);
}
