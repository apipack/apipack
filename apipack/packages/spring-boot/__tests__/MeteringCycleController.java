package com.yzw.ibuild.commerce.portal.controller.basic;

import com.yzw.ibuild.base.dto.DtoResult;
import com.yzw.ibuild.base.entity.BasePageResult;
import com.yzw.ibuild.commerce.business.module.basic.service.CmcBasicMeteringCycleHistoryService;
import com.yzw.ibuild.commerce.business.module.basic.vo.MeteringCycleHistoryQuery;
import com.yzw.ibuild.commerce.business.module.basic.vo.MeteringCycleHistoryVo;
import com.yzw.ibuild.commerce.interfaces.dto.MeteringCycleHistoryDto;
import com.yzw.ibuild.commerce.interfaces.dto.MeteringCycleHistoryQueryDto;
import com.yzw.ibuild.commerce.interfaces.service.MeteringCycleHistoryContract;
import com.yzw.ibuild.common.utils.BeanCopierUtils;
import com.yzw.ibuild.common.utils.ValidateUtils;
import com.yzw.ibuild.sso.core.response.LoginUser;
import com.yzw.ibuild.sso.core.util.AuthUtil;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Validated
@RestController
@RequestMapping("/api/commerce/basic/list")
@Api(tags = "Basic", description = "基础设置")
public class MeteringCycleController implements MeteringCycleHistoryContract {
    @Autowired
    private CmcBasicMeteringCycleHistoryService service;

    @ApiOperation(value = "获取计量周期列表")
    @PostMapping("/meteringCycle")
    public DtoResult<BasePageResult<MeteringCycleHistoryVo>> getMeteringCycleHistoryList(@RequestBody @Valid @NotNull(message = "查询条件不能为空") MeteringCycleHistoryQuery query) {
        LoginUser loginUser = AuthUtil.getAuthUser();
        query.setTenantSysNo(loginUser.getTenantSysNo());
        BasePageResult<MeteringCycleHistoryVo> result = service.getAllMeteringCycleHistoryBy(query);
        return DtoResult.ok(result);
    }

    @Override
    @ApiOperation(value = "获取计量周期列表")
    @PostMapping("/listMeteringCycleHistories")
    public List<MeteringCycleHistoryDto> listMeteringCycleHistories(@RequestBody MeteringCycleHistoryQueryDto query) {
        ValidateUtils.isNull(query, "查询条件不能为空");
        return service.listMeteringCycleHistories(query);
    }

    @ApiOperation("获取计量周期在某个时间段返回的数量")
    @PostMapping("/getMeteringCycleCount")
    public DtoResult<Integer> getMeteringCycleHistoryCount(@RequestBody @Valid @NotNull(message = "查询条件不能为空") MeteringCycleHistoryQuery query) {
        LoginUser loginUser = AuthUtil.getAuthUser();
        query.setTenantSysNo(loginUser.getTenantSysNo());
        return DtoResult.ok(service.getMeteringCycleHistoryCount(query, new ArrayList<>()));
    }

    @ApiOperation("获取某年的所有计量周期")
    @GetMapping("/{year}")
    public DtoResult<List<MeteringCycleHistoryVo>> listMeteringCycleHistoriesOfYear(@PathVariable("year") String year) {
        LoginUser loginUser = AuthUtil.getAuthUser();
        Date now = new Date();
        List<MeteringCycleHistoryVo> result = service.listCmcBasicMeteringCycleHistoriesByYear(year, loginUser.getTenantSysNo())
                .stream().filter(it -> it.getMeteringCycleStartDate().before(now))
                .map(it -> {
                    MeteringCycleHistoryVo meteringCycleHistoryVo = new MeteringCycleHistoryVo();
                    BeanCopierUtils.copy(it, meteringCycleHistoryVo);
                    return meteringCycleHistoryVo;
                }).collect(Collectors.toList());
        return DtoResult.ok(result);
    }
}
