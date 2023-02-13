package com.yzw.ibuild.commerce.interfaces.dto;

import com.yzw.ibuild.base.enums.CommonStatusEnum;
import com.yzw.ibuild.commerce.interfaces.enums.CostSbujectBusinessStatusEnum;
import com.yzw.ibuild.commerce.interfaces.enums.CostSbujectLevelEnum;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;

/**
 * 查询成本科目表
 *
 * @author chengjinqing764
 * @date 2020-10-28 18:09:51
 */
@Data
public class CmcBasicCostSubjectDto implements Serializable {

    /**
     * 主键编号
     */
    private Long sysNo;
    /**
     * 成本科目父节点主键
     */
    private Long parentSysNo;
    /**
     * 成本科目编码
     */
    private String costSubjectCode;
    /**
     * 成本科目层级编码
     */
    private String levelCode;
    /**
     * 成本科目名称
     */
    private String costSubjectName;
    /**
     * 成本科目级别
     */
    private CostSbujectLevelEnum costSubjectLevel;
    /**
     * 备注
     */
    private String remark;
    /**
     * 单位名称
     */
    private String unitName;
    /**
     * 支出类型，1：分包工程支出，2：直接材料/工程材料，3：直接人工费，4：机械使用费，5：其他直接费用，6：间接费用
     */
    private String expenditureType;
    /**
     * 业务状态，1：启用，2：禁用
     */
    private CostSbujectBusinessStatusEnum businessStatus;
    /**
     * 租户编号
     */
    private Integer tenantSysNo;
    /**
     * 数据状态，1：有效，0：删除
     */
    private CommonStatusEnum commonStatus;
    /**
     * 创建时间
     */
    private Date inDate;
    /**
     * 创建人
     */
    private Integer inUserSysNo;
    /**
     * 创建人名称
     */
    private String inUserName;
    /**
     * 编辑时间
     */
    private Date editDate;
    /**
     * 编辑人编号
     */
    private Integer editUserSysNo;
    /**
     * 编辑人名称
     */
    private String editUserName;


}
