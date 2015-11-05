package com.hr.xl.kq.service;

import org.g4studio.common.service.BaseService;
import org.g4studio.core.metatype.Dto;

public interface DkjService extends BaseService {
	public Dto saveDkjlbItem(Dto pDto);

	public Dto deleteDkjlbItem(Dto pDto);

	public Dto updateDkjlbItem(Dto pDto);
}
