using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Xml;

namespace webapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SchemeController : ControllerBase
    {
        private DbCollectionContext db;

        public SchemeController(DbCollectionContext db)
        {
            this.db = db;
        }

        [HttpGet("GetTipNpoTable")]
        public IActionResult GetTipNpoTable()
        {
            return Ok(db.TipNpos.ToList());
        }

        // From surface to product park
        [HttpGet("GetParentInjectionOutList")]
        public IActionResult GetParentInjectionOutList()
        {
            return Ok((from scheme in db.Schemes
                       where scheme.ParentId == 0
                       select new
                       {
                           id = scheme.Id,
                           name = scheme.Nam
                       }).ToList());
        }

        public class DownClassificationLevel
        {
            public int Id { get; set; }
            public string Name { get; set; } = "";
            public string Name2 { get; set; } = "";

            DownClassificationLevel() { }

            public DownClassificationLevel(int id, string name, string name2)
            {
                Id = id;
                Name = name;
                Name2 = name2;
            }
        }

        [HttpGet("GetInjectionInOutClassification")]
        public Dictionary<string, Dictionary<string, DownClassificationLevel[]>> GetInjectionInOutClassification()
        {
            var tipNpos = db.TipNpos.ToList();

            var resultClassification = new Dictionary<string, Dictionary<string, DownClassificationLevel[]>>();


            var injectionOutGroupObjects = new Dictionary<string, DownClassificationLevel[]>(){
                { "Скважина", new DownClassificationLevel[] {
                    new DownClassificationLevel(1,
                        tipNpos.First(x => x.TipNpoId == 1).Name,
                        tipNpos.First(x => x.TipNpoId == 1).Name2)
                    }
                },
                { "Замерные пункты", new DownClassificationLevel[] {
                    new DownClassificationLevel(7,
                        tipNpos.First(x => x.TipNpoId == 7).Name,
                        tipNpos.First(x => x.TipNpoId == 7).Name2),
                    new DownClassificationLevel(12,
                        tipNpos.First(x => x.TipNpoId == 12).Name,
                        tipNpos.First(x => x.TipNpoId == 12).Name2)
                    }
                },
                { "Сборные пункты", new DownClassificationLevel[] {
                    new DownClassificationLevel(5,
                        tipNpos.First(x => x.TipNpoId == 5).Name,
                        tipNpos.First(x => x.TipNpoId == 5).Name2),
                    new DownClassificationLevel(6,
                        tipNpos.First(x => x.TipNpoId == 6).Name,
                        tipNpos.First(x => x.TipNpoId == 6).Name2)
                    }
                },
                { "Товарный парк", new DownClassificationLevel[] {
                    new DownClassificationLevel(10,
                        tipNpos.First(x => x.TipNpoId == 10).Name,
                        tipNpos.First(x => x.TipNpoId == 10).Name2)
                    }
                },
                { "Неопределенное", new DownClassificationLevel[] {
                    new DownClassificationLevel(2,
                        tipNpos.First(x => x.TipNpoId == 2).Name,
                        tipNpos.First(x => x.TipNpoId == 2).Name2),
                    new DownClassificationLevel(3,
                        tipNpos.First(x => x.TipNpoId == 3).Name,
                        tipNpos.First(x => x.TipNpoId == 3).Name2),
                    new DownClassificationLevel(4,
                        tipNpos.First(x => x.TipNpoId == 4).Name,
                        tipNpos.First(x => x.TipNpoId == 4).Name2),
                    new DownClassificationLevel(11,
                        tipNpos.First(x => x.TipNpoId == 11).Name,
                        tipNpos.First(x => x.TipNpoId == 11).Name2),
                    new DownClassificationLevel(13,
                        tipNpos.First(x => x.TipNpoId == 13).Name,
                        tipNpos.First(x => x.TipNpoId == 13).Name2),
                    new DownClassificationLevel(14,
                        tipNpos.First(x => x.TipNpoId == 14).Name,
                        tipNpos.First(x => x.TipNpoId == 14).Name2),
                    new DownClassificationLevel(16,
                        tipNpos.First(x => x.TipNpoId == 16).Name,
                        tipNpos.First(x => x.TipNpoId == 16).Name2),
                    new DownClassificationLevel(25,
                        tipNpos.First(x => x.TipNpoId == 25).Name,
                        tipNpos.First(x => x.TipNpoId == 25).Name2),
                    new DownClassificationLevel(26,
                        tipNpos.First(x => x.TipNpoId == 26).Name,
                        tipNpos.First(x => x.TipNpoId == 26).Name2),
                    new DownClassificationLevel(27,
                        tipNpos.First(x => x.TipNpoId == 27).Name,
                        tipNpos.First(x => x.TipNpoId == 27).Name2)
                    }
                }
            };

            resultClassification.Add("Объекты схемы сбора", injectionOutGroupObjects);

            return resultClassification;
        }

        class ObjectNodeFormat
        {
            public int id { get; set; }
            public int parent_id { get; set; }
            public int parent_npo_id { get; set; }
            public int tip_npo_id { get; set; }
            public string tip_npo_name { get; set; } = "";
            public string name { get; set; } = "";
        }

        [HttpGet("GetInjectionOutTreeTable")]
        public IActionResult GetInjectionOutTreeTable(int productParkId, string selectedTipNpoIdsString)
        {
            var selectedTipNpoIds = selectedTipNpoIdsString.Split(";").Select(x => Convert.ToInt32(x)).ToArray();
            var globalClassification = GetInjectionInOutClassification();
            var result = new Dictionary<string, List<ObjectNodeFormat>>();

            var resultTable = (from scheme in db.Schemes
                               where scheme.Id == productParkId
                               select new ObjectNodeFormat
                               {
                                   id = scheme.Id,
                                   parent_id = scheme.ParentId,
                                   parent_npo_id = scheme.ParentTipNpoId ?? 0,
                                   tip_npo_id = scheme.TipNpoId,
                                   tip_npo_name = scheme.TipNpo.Name,
                                   name = scheme.Nam ?? ""
                               }).ToList();

            for (int index = 0; index < resultTable.Count; index++)
            {
                var forAdd = (from scheme in db.Schemes
                              where scheme.ParentId == resultTable[index].id
                              select new ObjectNodeFormat
                              {
                                  id = scheme.Id,
                                  parent_id = scheme.ParentId,
                                  parent_npo_id = scheme.ParentTipNpoId ?? 0,
                                  tip_npo_id = scheme.TipNpoId,
                                  tip_npo_name = scheme.TipNpo.Name,
                                  name = scheme.Nam ?? ""
                              }).ToList();

                resultTable.AddRange(forAdd);
            }

            foreach (var topClassification in globalClassification.Values)
            {
                foreach(var middleClassification in topClassification)
                {
                    int[] middle_tip_npo_ids = middleClassification.Value.Select(x => x.Id).Where(x => selectedTipNpoIds.Contains(x)).ToArray();

                    var middleResult = resultTable.Where(x => middle_tip_npo_ids.Contains(x.tip_npo_id)).ToList();

                    if(middleResult.Count() > 0)
                    {
                        result.Add(middleClassification.Key, middleResult);
                    }
                }
            }

            return Ok(result);
        }

        [HttpGet("GetObjectInfo")]
        public IActionResult GetObjectFullInfo(int objectId)
        {
            var result = (from scheme in db.Schemes
                          where scheme.Id == objectId
                          select new
                          {
                              scheme.Id,
                              scheme.ParentId,
                              TipNpoName = scheme.TipNpo.Name,
                              scheme.FlSx,
                              scheme.Ctip,
                              scheme.Nam,
                              scheme.NpoId
                          }).FirstOrDefault();

            return Ok(result);
        }
    }
}
