package com.hr.xl.lxy.service;

import org.g4studio.common.service.BaseService;
import org.g4studio.core.metatype.Dto;

public interface BdjlService extends BaseService {

	public void saveLxybdjlItem(Dto pDto);

	public Dto deleteLxybdjlItem(Dto pDto);

	public Dto updateLxybdjlItem(Dto pDto);
}
