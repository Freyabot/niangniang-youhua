// Generated from CONTENT_LIBRARY.md by scripts/build-content.py. Do not edit by hand.
const content = {
  "ui": {
    "ui.brand.name": "娘娘有话",
    "ui.entry.hook": "臣妾今日，又被拉会了。",
    "ui.brand.tagline": "职场不便说的，让娘娘来说。",
    "ui.entry.enter": "入宫",
    "ui.library.name": "案卷库",
    "ui.profession.title": "今日在宫中，领的是什么差事？",
    "ui.profession.product.situation": "折子呈了八回，御前只道再议",
    "ui.profession.developer.situation": "懿旨今夜才下，明早便要交差",
    "ui.profession.operations.situation": "今日恩宠几何，还得拿数自证",
    "ui.profession.design.situation": "宫装改了七回，最后仍用初稿",
    "ui.profession.algorithm.situation": "章法无人看懂，结果人人催问",
    "ui.locked.profession": "此差事尚未开缺。",
    "ui.preview.confirm": "就选她",
    "ui.preview.back": "再看看",
    "ui.locked.role": "此位主子尚未入宫。",
    "ui.locked.scene": "此典尚在筹备中。",
    "ui.scene.first_guide": "左右滑动查看全景，点点画面，看看哪处藏着今日的难处。",
    "ui.scene.hint": "提灯一照",
    "ui.scene.hint_complete": "灯下无遗",
    "ui.scene.progress": "已寻得 {current} / {total}",
    "ui.scene.complete": "这一殿的心事，都被你看见了。",
    "ui.scene.open_library": "翻看案卷库",
    "ui.scene.switch_role": "换位主子再看",
    "ui.dialogue.open_case": "翻看案卷 ›",
    "ui.library.title": "{profession}案卷库",
    "ui.library.current_role": "当前主子",
    "ui.library.progress": "已寻得 {current} / {total}",
    "ui.library.locked_case": "此句尚未寻得",
    "ui.case.title": "宫中案卷",
    "ui.case.field.profession": "差事",
    "ui.case.field.role": "主子",
    "ui.case.field.rank": "位份",
    "ui.case.field.palace_scene": "宫廷场景",
    "ui.case.field.work_scene": "职场场景",
    "ui.case.field.cause": "案由",
    "ui.case.field.verdict": "判词",
    "ui.case.back_scene": "回到场景",
    "ui.case.go_scene": "去此场景",
    "ui.case.export": "存下这句",
    "ui.export.sharing": "分享这句",
    "ui.export.save": "保存图片",
    "ui.export.long_press": "长按图片保存",
    "ui.export.generating": "正在落印…",
    "ui.export.success": "此句已收入袖中。",
    "ui.export.failed": "落印未成，请再试一次。",
    "ui.storage.temporary": "本次记录暂存，离开后可能消失。",
    "ui.storage.clear": "清空本地记录",
    "ui.storage.clear_confirm": "所有已寻得案卷都将清空，且无法撤销。仍要清空吗？",
    "ui.case.unavailable": "此案卷暂不可查",
    "ui.resource.failed": "此景尚未布置妥当。",
    "ui.resource.retry": "重新布置",
    "ui.resource.back": "返回选场景",
    "ui.orientation.portrait": "竖屏体验更佳",
    "ui.scene.found_static": "已寻得"
  },
  "roles": {
    "zhenhuan": {
      "id": "zhenhuan",
      "name": "甄嬛",
      "rank": "常在",
      "residence": "碎玉轩",
      "selfReference": "嫔妾",
      "persona": "隐忍聪慧，话里有话",
      "suitsYou": "想通了才开口的你",
      "playable": true
    },
    "huafei": {
      "id": "huafei",
      "name": "华妃",
      "rank": "妃",
      "residence": "翊坤宫",
      "selfReference": "本宫",
      "persona": "心直口快，从不憋着",
      "suitsYou": "今天就想直接怼回去的你",
      "playable": true
    },
    "anlingrong": {
      "id": "anlingrong",
      "name": "安陵容",
      "rank": "答应",
      "residence": "延禧宫",
      "selfReference": "嫔妾",
      "persona": "位份最低，活儿最多的小鸟",
      "suitsYou": "默默接下一切、又想自嘲的你",
      "playable": true
    },
    "empress": {
      "id": "empress",
      "name": "皇后",
      "rank": "皇后",
      "residence": "景仁宫",
      "selfReference": "本宫",
      "persona": "端庄体面，笑里藏刀",
      "suitsYou": "—",
      "playable": false
    },
    "shenmeizhuang": {
      "id": "shenmeizhuang",
      "name": "沈眉庄",
      "rank": "贵人",
      "residence": "咸福宫",
      "selfReference": "嫔妾",
      "persona": "清冷正直，讲道理",
      "suitsYou": "—",
      "playable": false
    }
  },
  "scenes": {
    "review": {
      "id": "review",
      "palaceName": "封妃大典",
      "workName": "需求评审会",
      "mood": "被质疑 · 被驳回",
      "statusLabel": "可玩",
      "playable": true
    },
    "report": {
      "id": "report",
      "palaceName": "御前核账",
      "workName": "向上汇报",
      "mood": "揣摩上意 · 紧张",
      "statusLabel": "可玩",
      "playable": true
    },
    "urgent_request": {
      "id": "urgent_request",
      "palaceName": "翊坤宫罚跪",
      "workName": "临时加需求",
      "mood": "被压榨 · 无力",
      "statusLabel": "筹备中",
      "playable": false
    },
    "retrospective": {
      "id": "retrospective",
      "palaceName": "滴血验亲",
      "workName": "项目复盘会",
      "mood": "被追责 · 无人认领",
      "statusLabel": "筹备中",
      "playable": false
    }
  },
  "openings": {
    "review": "册封仪注改至第八稿，皇后仍道：“祖制这一块，尚未对齐。”",
    "report": "六宫总账呈到御前，皇上朱笔一圈：“这笔超支，谁来闭环？”"
  },
  "causes": {
    "hotspot.review.ritual_v8": "册封仪注第八稿，御前还在走流程",
    "hotspot.review.empress_rule": "皇后批了“不合祖制”，改法会后同步",
    "hotspot.review.auspicious_time": "圣意尚未拍板，吉时已经锁了排期",
    "hotspot.review.new_decree": "口谕临时加一条：今晚辛苦诸位",
    "hotspot.review.backup_plan": "御前尚未拍板，备选章程先行兜底",
    "hotspot.review.compromise_rejected": "妥协稿奉上：已阅，零采纳",
    "hotspot.review.risk_note": "末页风险早已写明，御前显示未读",
    "hotspot.report.total_ledger": "总账已呈御前：材料已阅，请直接说结论",
    "hotspot.report.clothing_overspend": "皇上朱圈衣料一笔：“这项异常，单独拉会。”",
    "hotspot.report.receipt_booklets": "各宫分册都到齐了，数据口径还没对齐",
    "hotspot.report.third_tea": "御前茶都换了三盏，汇报还在讲项目背景",
    "hotspot.report.reconciliation_note": "账下早备核对笺，差额来处全程可追溯",
    "hotspot.report.reward_list": "翊坤宫赏赐单：战略投入被朱笔圈成超支",
    "hotspot.report.supplement_note": "末页补录一签：差事已办，绩效系统判定“未参与”"
  },
  "monologues": {
    "monologue.product.review.zhenhuan": "这场评审，满殿都在等圣意，圣意却像也在等人先开口。",
    "monologue.product.review.huafei": "第八版还在“再议”。吉时都比满殿的人有主见。",
    "monologue.product.review.anlingrong": "御前拍板没我的份，改稿倒回回有我。第九版的位置，先留着吧。",
    "monologue.developer.review.zhenhuan": "圣意未定，排期先行。若联调还能剩下一夜，也算这吉时格外体恤。",
    "monologue.developer.review.huafei": "需求一日三变，吉时纹丝不动。很好，就差代码自己长了。",
    "monologue.developer.review.anlingrong": "口谕还没说全，排期已经写死。少的时辰，照例从我的夜里扣。",
    "monologue.product.report.zhenhuan": "总账写了十页，御前仍只等一句拍板。看来字多，也未必算有结论。",
    "monologue.product.report.huafei": "朱笔把“超支”圈得这样大，处置方案倒没跟着显灵。",
    "monologue.product.report.anlingrong": "总账人人看过，待拍板的事却无人认领。轮到开口时，我的位份忽然就够了。",
    "monologue.developer.report.zhenhuan": "御前只圈一个数，背后却牵着一串依赖。若根因肯排队来见，倒省事了。",
    "monologue.developer.report.huafei": "朱笔落得真快。根因若靠一圈便有，日志也不必查了。",
    "monologue.developer.report.anlingrong": "总账只记一个“稳”字。维护写不进账里，故障倒总能找到我的名字。"
  },
  "quotes": {
    "quote.product.review.zhenhuan.ritual_v8": {
      "id": "quote.product.review.zhenhuan.ritual_v8",
      "profession": "product",
      "scene": "review",
      "role": "zhenhuan",
      "hotspot": "ritual_v8",
      "hotspotId": "hotspot.review.ritual_v8",
      "text": "仪注已改八回，想来是为求周全。只是圣意仍未落定，这一版也只好先叫“最新版”。",
      "reuseOf": null
    },
    "quote.product.review.zhenhuan.empress_rule": {
      "id": "quote.product.review.zhenhuan.empress_rule",
      "profession": "product",
      "scene": "review",
      "role": "zhenhuan",
      "hotspot": "empress_rule",
      "hotspotId": "hotspot.review.empress_rule",
      "text": "“不合祖制”四字，嫔妾记下了。若无一处明示，嫔妾该改方案，还是先学会揣摩圣意？",
      "reuseOf": null
    },
    "quote.product.review.zhenhuan.auspicious_time": {
      "id": "quote.product.review.zhenhuan.auspicious_time",
      "profession": "product",
      "scene": "review",
      "role": "zhenhuan",
      "hotspot": "auspicious_time",
      "hotspotId": "hotspot.review.auspicious_time",
      "text": "吉时先定，确是顾全大局。可目标尚在斟酌，这排期究竟替哪桩差事作保？",
      "reuseOf": null
    },
    "quote.product.review.zhenhuan.new_decree": {
      "id": "quote.product.review.zhenhuan.new_decree",
      "profession": "product",
      "scene": "review",
      "role": "zhenhuan",
      "hotspot": "new_decree",
      "hotspotId": "hotspot.review.new_decree",
      "text": "口谕既下，新增需求自当入席。优先级的上席只有一处，不知原先哪一项该让位？",
      "reuseOf": null
    },
    "quote.product.review.zhenhuan.backup_plan": {
      "id": "quote.product.review.zhenhuan.backup_plan",
      "profession": "product",
      "scene": "review",
      "role": "zhenhuan",
      "hotspot": "backup_plan",
      "hotspotId": "hotspot.review.backup_plan",
      "text": "详案保周全，简案保排期，嫔妾都备下了。若两样都要，怕得再添一套神仙方案。",
      "reuseOf": null
    },
    "quote.product.review.huafei.ritual_v8": {
      "id": "quote.product.review.huafei.ritual_v8",
      "profession": "product",
      "scene": "review",
      "role": "huafei",
      "hotspot": "ritual_v8",
      "hotspotId": "hotspot.review.ritual_v8",
      "text": "仪注改到第八版还不拍板？拿本宫的方案练手，也该练够了。",
      "reuseOf": null
    },
    "quote.product.review.huafei.empress_rule": {
      "id": "quote.product.review.huafei.empress_rule",
      "profession": "product",
      "scene": "review",
      "role": "huafei",
      "hotspot": "empress_rule",
      "hotspotId": "hotspot.review.empress_rule",
      "text": "只说不合祖制，却不说怎么才合。本宫倒要问问，这叫评审，还是猜谜？",
      "reuseOf": null
    },
    "quote.product.review.huafei.auspicious_time": {
      "id": "quote.product.review.huafei.auspicious_time",
      "profession": "product",
      "scene": "review",
      "role": "huafei",
      "hotspot": "auspicious_time",
      "hotspotId": "hotspot.review.auspicious_time",
      "text": "目标未定，排期倒锁死了。拿空气去保这吉时？",
      "reuseOf": null
    },
    "quote.product.review.huafei.new_decree": {
      "id": "quote.product.review.huafei.new_decree",
      "profession": "product",
      "scene": "review",
      "role": "huafei",
      "hotspot": "new_decree",
      "hotspotId": "hotspot.review.new_decree",
      "text": "新口谕要进排期，就让旧需求让位。什么都往里塞，当本宫这里没有门槛？",
      "reuseOf": null
    },
    "quote.product.review.huafei.compromise_rejected": {
      "id": "quote.product.review.huafei.compromise_rejected",
      "profession": "product",
      "scene": "review",
      "role": "huafei",
      "hotspot": "compromise_rejected",
      "hotspotId": "hotspot.review.compromise_rejected",
      "text": "范围不减、目标不少、吉时不改？许愿单也不敢写得这样满。",
      "reuseOf": null
    },
    "quote.product.review.anlingrong.ritual_v8": {
      "id": "quote.product.review.anlingrong.ritual_v8",
      "profession": "product",
      "scene": "review",
      "role": "anlingrong",
      "hotspot": "ritual_v8",
      "hotspotId": "hotspot.review.ritual_v8",
      "text": "第八版也无妨，前七版的返工，想来都算嫔妾的成长。",
      "reuseOf": null
    },
    "quote.product.review.anlingrong.empress_rule": {
      "id": "quote.product.review.anlingrong.empress_rule",
      "profession": "product",
      "scene": "review",
      "role": "anlingrong",
      "hotspot": "empress_rule",
      "hotspotId": "hotspot.review.empress_rule",
      "text": "娘娘只说不合祖制，嫔妾自己改便是。若再不合，想来又是嫔妾理解不到位。",
      "reuseOf": null
    },
    "quote.product.review.anlingrong.auspicious_time": {
      "id": "quote.product.review.anlingrong.auspicious_time",
      "profession": "product",
      "scene": "review",
      "role": "anlingrong",
      "hotspot": "auspicious_time",
      "hotspotId": "hotspot.review.auspicious_time",
      "text": "吉时已经圈了，诸位只管慢慢斟酌，临到大典再叫嫔妾加急便是。",
      "reuseOf": null
    },
    "quote.product.review.anlingrong.new_decree": {
      "id": "quote.product.review.anlingrong.new_decree",
      "profession": "product",
      "scene": "review",
      "role": "anlingrong",
      "hotspot": "new_decree",
      "hotspotId": "hotspot.review.new_decree",
      "text": "口谕既下，嫔妾改便是。只是这“临时需求”，怎么回回都来得这样准时？",
      "reuseOf": null
    },
    "quote.product.review.anlingrong.risk_note": {
      "id": "quote.product.review.anlingrong.risk_note",
      "profession": "product",
      "scene": "review",
      "role": "anlingrong",
      "hotspot": "risk_note",
      "hotspotId": "hotspot.review.risk_note",
      "text": "前置风险早写在末页了。想来嫔妾位份低，连批注也默认不展开。",
      "reuseOf": null
    },
    "quote.product.report.zhenhuan.total_ledger": {
      "id": "quote.product.report.zhenhuan.total_ledger",
      "profession": "product",
      "scene": "report",
      "role": "zhenhuan",
      "hotspot": "total_ledger",
      "hotspotId": "hotspot.report.total_ledger",
      "text": "总账既已御览，嫔妾便不复念了。十页进度、三处风险，原来最后只等御前一处定夺。",
      "reuseOf": null
    },
    "quote.product.report.zhenhuan.clothing_overspend": {
      "id": "quote.product.report.zhenhuan.clothing_overspend",
      "profession": "product",
      "scene": "report",
      "role": "zhenhuan",
      "hotspot": "clothing_overspend",
      "hotspotId": "hotspot.report.clothing_overspend",
      "text": "皇上一笔朱圈，真真醒目。只是这数只会喊“异常”，是否会误了目标，它自己如何说得清？",
      "reuseOf": null
    },
    "quote.product.report.zhenhuan.receipt_booklets": {
      "id": "quote.product.report.zhenhuan.receipt_booklets",
      "profession": "product",
      "scene": "report",
      "role": "zhenhuan",
      "hotspot": "receipt_booklets",
      "hotspotId": "hotspot.report.receipt_booklets",
      "text": "各宫分册皆有凭据，偏偏合不出同一个结论。口径若各自为政，数据再多又有何益？",
      "reuseOf": null
    },
    "quote.product.report.zhenhuan.third_tea": {
      "id": "quote.product.report.zhenhuan.third_tea",
      "profession": "product",
      "scene": "report",
      "role": "zhenhuan",
      "hotspot": "third_tea",
      "hotspotId": "hotspot.report.third_tea",
      "text": "茶已换了三盏，嫔妾便拣要紧的说：前因两句，取舍一句，余下只请御前定夺。",
      "reuseOf": null
    },
    "quote.product.report.zhenhuan.reconciliation_note": {
      "id": "quote.product.report.zhenhuan.reconciliation_note",
      "profession": "product",
      "scene": "report",
      "role": "zhenhuan",
      "hotspot": "reconciliation_note",
      "hotspotId": "hotspot.report.reconciliation_note",
      "text": "差额来处与处理方案都在笺上。若仍不能落定，想来只差结论自己开口了。",
      "reuseOf": null
    },
    "quote.product.report.huafei.total_ledger": {
      "id": "quote.product.report.huafei.total_ledger",
      "profession": "product",
      "scene": "report",
      "role": "huafei",
      "hotspot": "total_ledger",
      "hotspotId": "hotspot.report.total_ledger",
      "text": "总账既然看过了，本宫就不念。结论只有一句：该拍板的，还没拍板。",
      "reuseOf": null
    },
    "quote.product.report.huafei.clothing_overspend": {
      "id": "quote.product.report.huafei.clothing_overspend",
      "profession": "product",
      "scene": "report",
      "role": "huafei",
      "hotspot": "clothing_overspend",
      "hotspotId": "hotspot.report.clothing_overspend",
      "text": "看过满册背景，还是只问这一笔异常？先说清楚，它到底影不影响目标。",
      "reuseOf": null
    },
    "quote.product.report.huafei.receipt_booklets": {
      "id": "quote.product.report.huafei.receipt_booklets",
      "profession": "product",
      "scene": "report",
      "role": "huafei",
      "hotspot": "receipt_booklets",
      "hotspotId": "hotspot.report.receipt_booklets",
      "text": "三本账，三个口径，还想要一个结论？先把数对齐，再来回话。",
      "reuseOf": null
    },
    "quote.product.report.huafei.third_tea": {
      "id": "quote.product.report.huafei.third_tea",
      "profession": "product",
      "scene": "report",
      "role": "huafei",
      "hotspot": "third_tea",
      "hotspotId": "hotspot.report.third_tea",
      "text": "茶换三盏了，本宫只说重点：要保目标，就得做取舍。现在拍板。",
      "reuseOf": null
    },
    "quote.product.report.huafei.reward_list": {
      "id": "quote.product.report.huafei.reward_list",
      "profession": "product",
      "scene": "report",
      "role": "huafei",
      "hotspot": "reward_list",
      "hotspotId": "hotspot.report.reward_list",
      "text": "赏赐单上这笔投入保的是结果。只看成本，不看价值，这账本宫不认。",
      "reuseOf": null
    },
    "quote.product.report.anlingrong.total_ledger": {
      "id": "quote.product.report.anlingrong.total_ledger",
      "profession": "product",
      "scene": "report",
      "role": "anlingrong",
      "hotspot": "total_ledger",
      "hotspotId": "hotspot.report.total_ledger",
      "text": "皇上既已看过总账，嫔妾便只报结论：各宫各有进展，总进度却又归嫔妾负责。",
      "reuseOf": null
    },
    "quote.product.report.anlingrong.clothing_overspend": {
      "id": "quote.product.report.anlingrong.clothing_overspend",
      "profession": "product",
      "scene": "report",
      "role": "anlingrong",
      "hotspot": "clothing_overspend",
      "hotspotId": "hotspot.report.clothing_overspend",
      "text": "满册用度只圈这一笔，嫔妾明白。九十九处妥当不算成绩，一处异常倒成了重点汇报。",
      "reuseOf": null
    },
    "quote.product.report.anlingrong.receipt_booklets": {
      "id": "quote.product.report.anlingrong.receipt_booklets",
      "profession": "product",
      "scene": "report",
      "role": "anlingrong",
      "hotspot": "receipt_booklets",
      "hotspotId": "hotspot.report.receipt_booklets",
      "text": "各宫分册都说自己没错，嫔妾只好来对齐。所谓口径一致，原是各自一致。",
      "reuseOf": null
    },
    "quote.product.report.anlingrong.third_tea": {
      "id": "quote.product.report.anlingrong.third_tea",
      "profession": "product",
      "scene": "report",
      "role": "anlingrong",
      "hotspot": "third_tea",
      "hotspotId": "hotspot.report.third_tea",
      "text": "御前茶已换到第三盏，嫔妾便长话短说。只是三个月的宫务，当真能压成三句汇报么？",
      "reuseOf": null
    },
    "quote.product.report.anlingrong.supplement_note": {
      "id": "quote.product.report.anlingrong.supplement_note",
      "profession": "product",
      "scene": "report",
      "role": "anlingrong",
      "hotspot": "supplement_note",
      "hotspotId": "hotspot.report.supplement_note",
      "text": "补录小签嫔妾早已递上。只是协调这桩差事，办时人人催，汇总时便自动隐藏。",
      "reuseOf": null
    },
    "quote.developer.review.zhenhuan.ritual_v8": {
      "id": "quote.developer.review.zhenhuan.ritual_v8",
      "profession": "developer",
      "scene": "review",
      "role": "zhenhuan",
      "hotspot": "ritual_v8",
      "hotspotId": "hotspot.review.ritual_v8",
      "text": "仪注八易，想来是越改越妥帖。只是前七版照着写的代码，如今都成了习字帖。",
      "reuseOf": null
    },
    "quote.developer.review.zhenhuan.empress_rule": {
      "id": "quote.developer.review.zhenhuan.empress_rule",
      "profession": "developer",
      "scene": "review",
      "role": "zhenhuan",
      "hotspot": "empress_rule",
      "hotspotId": "hotspot.review.empress_rule",
      "text": "娘娘说不合祖制，改便是了。可验收若仍凭“看着不妥”，往后改的是代码，猜的却是圣意。",
      "reuseOf": null
    },
    "quote.developer.review.zhenhuan.auspicious_time": {
      "id": "quote.developer.review.zhenhuan.auspicious_time",
      "profession": "developer",
      "scene": "review",
      "role": "zhenhuan",
      "hotspot": "auspicious_time",
      "hotspotId": "hotspot.review.auspicious_time",
      "text": "吉时早定，原是不能误的。只是开工一再迟延，留给联调的时辰，怕要从夜里借了。",
      "reuseOf": null
    },
    "quote.developer.review.zhenhuan.new_decree": {
      "id": "quote.developer.review.zhenhuan.new_decree",
      "profession": "developer",
      "scene": "review",
      "role": "zhenhuan",
      "hotspot": "new_decree",
      "hotspotId": "hotspot.review.new_decree",
      "text": "新口谕添进排期，自然也是要办的。不知原有差事与新增差事，哪一桩肯少占些时辰？",
      "reuseOf": null
    },
    "quote.developer.review.zhenhuan.backup_plan": {
      "id": "quote.developer.review.zhenhuan.backup_plan",
      "profession": "developer",
      "scene": "review",
      "role": "zhenhuan",
      "hotspot": "backup_plan",
      "hotspotId": "hotspot.review.backup_plan",
      "text": "圣意未明，嫔妾先备了主案与降级方案。若临上线又改主意，怕只余延期可选。",
      "reuseOf": null
    },
    "quote.developer.review.huafei.ritual_v8": {
      "id": "quote.developer.review.huafei.ritual_v8",
      "profession": "developer",
      "scene": "review",
      "role": "huafei",
      "hotspot": "ritual_v8",
      "hotspotId": "hotspot.review.ritual_v8",
      "text": "仪注第八版一到，前七版的代码又得重写。好一场返工大典。",
      "reuseOf": null
    },
    "quote.developer.review.huafei.empress_rule": {
      "id": "quote.developer.review.huafei.empress_rule",
      "profession": "developer",
      "scene": "review",
      "role": "huafei",
      "hotspot": "empress_rule",
      "hotspotId": "hotspot.review.empress_rule",
      "text": "不合祖制？把验收标准说清楚。本宫没工夫拿代码猜心思。",
      "reuseOf": null
    },
    "quote.developer.review.huafei.auspicious_time": {
      "id": "quote.developer.review.huafei.auspicious_time",
      "profession": "developer",
      "scene": "review",
      "role": "huafei",
      "hotspot": "auspicious_time",
      "hotspotId": "hotspot.review.auspicious_time",
      "text": "开工一拖再拖，联调一日不许少？这排期是拿夜里凑出来的？",
      "reuseOf": null
    },
    "quote.developer.review.huafei.new_decree": {
      "id": "quote.developer.review.huafei.new_decree",
      "profession": "developer",
      "scene": "review",
      "role": "huafei",
      "hotspot": "new_decree",
      "hotspotId": "hotspot.review.new_decree",
      "text": "新口谕要进排期，可以。原任务不减、时辰不加，本宫不接。",
      "reuseOf": null
    },
    "quote.developer.review.huafei.compromise_rejected": {
      "id": "quote.developer.review.huafei.compromise_rejected",
      "profession": "developer",
      "scene": "review",
      "role": "huafei",
      "hotspot": "compromise_rejected",
      "hotspotId": "hotspot.review.compromise_rejected",
      "text": "范围、质量、时辰，一个都不许动？那便别问本宫为何交不出来。",
      "reuseOf": null
    },
    "quote.developer.review.anlingrong.ritual_v8": {
      "id": "quote.developer.review.anlingrong.ritual_v8",
      "profession": "developer",
      "scene": "review",
      "role": "anlingrong",
      "hotspot": "ritual_v8",
      "hotspotId": "hotspot.review.ritual_v8",
      "text": "仪注改到第八版也无妨，前七版照着做的实现，想来都算技术债了。",
      "reuseOf": null
    },
    "quote.developer.review.anlingrong.empress_rule": {
      "id": "quote.developer.review.anlingrong.empress_rule",
      "profession": "developer",
      "scene": "review",
      "role": "anlingrong",
      "hotspot": "empress_rule",
      "hotspotId": "hotspot.review.empress_rule",
      "text": "娘娘只说不合祖制，嫔妾重做便是。只是验收全凭圣意，做到哪一版都未必算合。",
      "reuseOf": null
    },
    "quote.developer.review.anlingrong.auspicious_time": {
      "id": "quote.developer.review.anlingrong.auspicious_time",
      "profession": "developer",
      "scene": "review",
      "role": "anlingrong",
      "hotspot": "auspicious_time",
      "hotspotId": "hotspot.review.auspicious_time",
      "text": "吉时既已圈定，嫔妾自然不敢耽搁。只是仪注每多改一日，留给联调的还能有几夜？",
      "reuseOf": null
    },
    "quote.developer.review.anlingrong.new_decree": {
      "id": "quote.developer.review.anlingrong.new_decree",
      "profession": "developer",
      "scene": "review",
      "role": "anlingrong",
      "hotspot": "new_decree",
      "hotspotId": "hotspot.review.new_decree",
      "text": "口谕添得正是时候，原先排好的差事一件未减，新活儿倒已有了优先级。",
      "reuseOf": null
    },
    "quote.developer.review.anlingrong.risk_note": {
      "id": "quote.developer.review.anlingrong.risk_note",
      "profession": "developer",
      "scene": "review",
      "role": "anlingrong",
      "hotspot": "risk_note",
      "hotspotId": "hotspot.review.risk_note",
      "text": "末页的风险嫔妾早已写明。若日后出了岔子，想来这句“已知悉”仍只算阅读回执。",
      "reuseOf": null
    },
    "quote.developer.report.zhenhuan.total_ledger": {
      "id": "quote.developer.report.zhenhuan.total_ledger",
      "profession": "developer",
      "scene": "report",
      "role": "zhenhuan",
      "hotspot": "total_ledger",
      "hotspotId": "hotspot.report.total_ledger",
      "text": "总账上只见一个“稳”字，真真清爽。只是系统安稳无事，背后的修补便也算作无事了。",
      "reuseOf": null
    },
    "quote.developer.report.zhenhuan.clothing_overspend": {
      "id": "quote.developer.report.zhenhuan.clothing_overspend",
      "profession": "developer",
      "scene": "report",
      "role": "zhenhuan",
      "hotspot": "clothing_overspend",
      "hotspotId": "hotspot.report.clothing_overspend",
      "text": "皇上圈的是数目，嫔妾查的却是来路。若一个数便能断根因，那些日志还留着做什么呢？",
      "reuseOf": null
    },
    "quote.developer.report.zhenhuan.receipt_booklets": {
      "id": "quote.developer.report.zhenhuan.receipt_booklets",
      "profession": "developer",
      "scene": "report",
      "role": "zhenhuan",
      "hotspot": "receipt_booklets",
      "hotspotId": "hotspot.report.receipt_booklets",
      "text": "各宫分册各自分明，凑在一处却互不相认。想来接口通了，也未必说的是同一种话。",
      "reuseOf": null
    },
    "quote.developer.report.zhenhuan.third_tea": {
      "id": "quote.developer.report.zhenhuan.third_tea",
      "profession": "developer",
      "scene": "report",
      "role": "zhenhuan",
      "hotspot": "third_tea",
      "hotspotId": "hotspot.report.third_tea",
      "text": "茶已换到第三盏，根因还差最后一证。若一句猜测也能算结论，排查倒可省了。",
      "reuseOf": null
    },
    "quote.developer.report.zhenhuan.reconciliation_note": {
      "id": "quote.developer.report.zhenhuan.reconciliation_note",
      "profession": "developer",
      "scene": "report",
      "role": "zhenhuan",
      "hotspot": "reconciliation_note",
      "hotspotId": "hotspot.report.reconciliation_note",
      "text": "依赖从何处断、该如何修、如何回退，笺上都写明了。若只问是谁的错，前半页便够了。",
      "reuseOf": null
    },
    "quote.developer.report.huafei.total_ledger": {
      "id": "quote.developer.report.huafei.total_ledger",
      "profession": "developer",
      "scene": "report",
      "role": "huafei",
      "hotspot": "total_ledger",
      "hotspotId": "hotspot.report.total_ledger",
      "text": "总账只写一个“稳”字，就当系统自己会好？背后的维护，本宫不许一笔抹了。",
      "reuseOf": null
    },
    "quote.developer.report.huafei.clothing_overspend": {
      "id": "quote.developer.report.huafei.clothing_overspend",
      "profession": "developer",
      "scene": "report",
      "role": "huafei",
      "hotspot": "clothing_overspend",
      "hotspotId": "hotspot.report.clothing_overspend",
      "text": "朱笔圈一个数就想定根因？日志、依赖都没看，这结论本宫不认。",
      "reuseOf": null
    },
    "quote.developer.report.huafei.receipt_booklets": {
      "id": "quote.developer.report.huafei.receipt_booklets",
      "profession": "developer",
      "scene": "report",
      "role": "huafei",
      "hotspot": "receipt_booklets",
      "hotspotId": "hotspot.report.receipt_booklets",
      "text": "接口是通了，三套记录却各说各话。这也叫数据对上了？",
      "reuseOf": null
    },
    "quote.developer.report.huafei.third_tea": {
      "id": "quote.developer.report.huafei.third_tea",
      "profession": "developer",
      "scene": "report",
      "role": "huafei",
      "hotspot": "third_tea",
      "hotspotId": "hotspot.report.third_tea",
      "text": "茶都换三盏了，根因还没查完，就催一句结论。要真能靠猜，本宫何必查日志？",
      "reuseOf": null
    },
    "quote.developer.report.huafei.reward_list": {
      "id": "quote.developer.report.huafei.reward_list",
      "profession": "developer",
      "scene": "report",
      "role": "huafei",
      "hotspot": "reward_list",
      "hotspotId": "hotspot.report.reward_list",
      "text": "这笔赏赐保的是监控与容灾。成本省下了，事故可不会跟着省。",
      "reuseOf": null
    },
    "quote.developer.report.anlingrong.total_ledger": {
      "id": "quote.developer.report.anlingrong.total_ledger",
      "profession": "developer",
      "scene": "report",
      "role": "anlingrong",
      "hotspot": "total_ledger",
      "hotspotId": "hotspot.report.total_ledger",
      "text": "一整月的修补维护，到了御前只剩一个数。嫔妾的工时，倒比账页还薄。",
      "reuseOf": null
    },
    "quote.developer.report.anlingrong.clothing_overspend": {
      "id": "quote.developer.report.anlingrong.clothing_overspend",
      "profession": "developer",
      "scene": "report",
      "role": "anlingrong",
      "hotspot": "clothing_overspend",
      "hotspotId": "hotspot.report.clothing_overspend",
      "text": "衣料这一笔的确异常，嫔妾不敢辩。只是只凭一个数查根因，竟比闻香辨料还容易么？",
      "reuseOf": null
    },
    "quote.developer.report.anlingrong.receipt_booklets": {
      "id": "quote.developer.report.anlingrong.receipt_booklets",
      "profession": "developer",
      "scene": "report",
      "role": "anlingrong",
      "hotspot": "receipt_booklets",
      "hotspotId": "hotspot.report.receipt_booklets",
      "text": "各宫分册单看都对，放在一处便互不相认。想来这几套账，也从未联调过。",
      "reuseOf": null
    },
    "quote.developer.report.anlingrong.third_tea": {
      "id": "quote.developer.report.anlingrong.third_tea",
      "profession": "developer",
      "scene": "report",
      "role": "anlingrong",
      "hotspot": "third_tea",
      "hotspotId": "hotspot.report.third_tea",
      "text": "御前茶已换到第三盏，嫔妾便说简单些：若三句话能讲清，日志也不必查到这会儿。",
      "reuseOf": null
    },
    "quote.developer.report.anlingrong.supplement_note": {
      "id": "quote.developer.report.anlingrong.supplement_note",
      "profession": "developer",
      "scene": "report",
      "role": "anlingrong",
      "hotspot": "supplement_note",
      "hotspotId": "hotspot.report.supplement_note",
      "text": "补录小签上都是些维护与补丁，平日无人记得；漏做一项，上线那日便人人记得嫔妾。",
      "reuseOf": null
    }
  },
  "previews": {
    "preview.product.zhenhuan": "quote.product.review.zhenhuan.backup_plan",
    "preview.product.huafei": "quote.product.review.huafei.compromise_rejected",
    "preview.product.anlingrong": "quote.product.review.anlingrong.ritual_v8",
    "preview.developer.zhenhuan": "quote.developer.review.zhenhuan.backup_plan",
    "preview.developer.huafei": "quote.developer.review.huafei.empress_rule",
    "preview.developer.anlingrong": "quote.developer.review.anlingrong.ritual_v8"
  },
  "sceneHotspots": {
    "review": {
      "shared": [
        "ritual_v8",
        "empress_rule",
        "auspicious_time",
        "new_decree"
      ],
      "exclusive": {
        "zhenhuan": "backup_plan",
        "huafei": "compromise_rejected",
        "anlingrong": "risk_note"
      }
    },
    "report": {
      "shared": [
        "total_ledger",
        "clothing_overspend",
        "receipt_booklets",
        "third_tea"
      ],
      "exclusive": {
        "zhenhuan": "reconciliation_note",
        "huafei": "reward_list",
        "anlingrong": "supplement_note"
      }
    }
  },
  "professions": [
    "product",
    "developer"
  ],
  "playableRoles": [
    "zhenhuan",
    "huafei",
    "anlingrong"
  ],
  "playableScenes": [
    "review",
    "report"
  ]
};

export const ui = content.ui;
export const roles = content.roles;
export const scenes = content.scenes;
export const openings = content.openings;
export const causes = content.causes;
export const monologues = content.monologues;
export const quotes = content.quotes;
export const previews = content.previews;
export const sceneHotspots = content.sceneHotspots;
export const professions = content.professions;
export const playableRoles = content.playableRoles;
export const playableScenes = content.playableScenes;
export default content;
