﻿using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Xml;

namespace webapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SchemeController : ControllerBase
    {
        private DbCollectionContext db;
        private Dictionary<string, Dictionary<string, DownClassificationLevel[]>>? _injectionInOutClassification = null;

        private Dictionary<string, Dictionary<string, DownClassificationLevel[]>> InjectionInOutClassification { 
            get {
                if (_injectionInOutClassification == null)
                    DefineInjectionInOutClassification();

#pragma warning disable CS8603 // Возможно, возврат ссылки, допускающей значение NULL.
                return _injectionInOutClassification;
#pragma warning restore CS8603 // Возможно, возврат ссылки, допускающей значение NULL.
            }
        }

        public SchemeController(DbCollectionContext db)
        {
            this.db = db;
        }

        private void DefineInjectionInOutClassification()
        {
            var tipNpos = db.TipNpos.ToList();

            _injectionInOutClassification = new Dictionary<string, Dictionary<string, DownClassificationLevel[]>>();


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
                }/*,
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
                }*/
            };

            _injectionInOutClassification.Add("Объекты схемы сбора", injectionOutGroupObjects);
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
            var result = (from scheme in db.Schemes
                          where scheme.ParentId == 0
                          select new
                          {
                              id = scheme.Id,
                              name = scheme.Nam
                          }).ToList();

            result.Insert(0, new { id = 0, name = "Не выбрано" });

            return Ok(result);
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
                Name = name.Trim();
                Name2 = name2.Trim();
            }
        }

        [HttpGet("GetInjectionInOutClassification")]
        public Dictionary<string, Dictionary<string, DownClassificationLevel[]>> GetInjectionInOutClassification()
        {
            return InjectionInOutClassification;
        }

        private List<int[]> ConvertInOutClassificationToIdGroups()
        {
            List<int[]> resultIdsGroup = new List<int[]>();

            var injectionInOutClassification = InjectionInOutClassification;

            foreach(var topClassification in injectionInOutClassification)
            {
                foreach (var middleClassifitcation in topClassification.Value)
                {
                    resultIdsGroup.Add(
                        middleClassifitcation.Value.Select(x => x.Id).ToArray()
                    );
                }
            }

            return resultIdsGroup;
        }

        private int[] GetAcceptedTipNpoIdArray(int[] selected_npo_tip_ids)
        {
            List<int[]> groupedInOutClassificationIds = ConvertInOutClassificationToIdGroups();
            List<int> acceptedInt = new List<int>();

            foreach(var selected in groupedInOutClassificationIds)
            {
                if(selected.Any(id => selected_npo_tip_ids.Contains(id)))
                {
                    acceptedInt.AddRange(selected.ToList());
                }
            }

            return acceptedInt.ToArray();
        }

        class ObjectNodeFormat
        {
            public int id { get; set; }
            public int parent_id { get; set; }
            public int parent_npo_id { get; set; }
            public int tip_npo_id { get; set; }
            public string tip_npo_name { get; set; } = "";
            public string full_name { get; set; } = "";
            public string name { get; set; } = "";
        }

        [HttpGet("GetInjectionOutTreeTable")]
        public IActionResult GetInjectionOutTreeTable(int productParkId, string selectedTipNpoIdsString)
        {
            var selectedTipNpoIds = selectedTipNpoIdsString.Split(";").Select(x => Convert.ToInt32(x)).ToArray();
            var resultDictionary = new Dictionary<string, ObjectNodeFormat[]>();

            var foundTreeObjectTable = (from scheme in db.Schemes
                               where scheme.Id == productParkId
                               select new ObjectNodeFormat
                               {
                                   id = scheme.Id,
                                   parent_id = scheme.ParentId,
                                   parent_npo_id = scheme.ParentTipNpoId ?? 0,
                                   tip_npo_id = scheme.TipNpoId,
                                   tip_npo_name = scheme.TipNpo.Name.Trim(),
                                   full_name = scheme.TipNpo.Name + " - " + (scheme.Nam == null ? "" : scheme.Nam.Trim()),
                                   name = scheme.Nam == null ? "" : scheme.Nam.Trim()
                               }).ToList();

            for (int index = 0; index < foundTreeObjectTable.Count; index++)
            {
                var forAdd = (from scheme in db.Schemes
                              where scheme.ParentId == foundTreeObjectTable[index].id
                              select new ObjectNodeFormat
                              {
                                  id = scheme.Id,
                                  parent_id = scheme.ParentId,
                                  parent_npo_id = scheme.ParentTipNpoId ?? 0,
                                  tip_npo_id = scheme.TipNpoId,
                                  tip_npo_name = scheme.TipNpo.Name.Trim(),
                                   full_name = scheme.TipNpo.Name + " - " + (scheme.Nam == null ? "" : scheme.Nam.Trim()),
                                  name = scheme.Nam == null ? "" : scheme.Nam.Trim()
                              }).ToList();

                foundTreeObjectTable.AddRange(forAdd);
            }

            var acceptedTipNpoIds = GetAcceptedTipNpoIdArray(selectedTipNpoIds);
            
            var globalClassification = InjectionInOutClassification;

            foreach (var topClassification in globalClassification.Values)
            {
                foreach (var middleClassification in topClassification)
                {
                    int[] middle_tip_npo_ids = middleClassification.Value.Select(x => x.Id).ToArray();
                    int[] selected_middle_tip_npo_ids = middle_tip_npo_ids.Where(x => selectedTipNpoIds.Contains(x)).ToArray();

                    if (selected_middle_tip_npo_ids.Count() == 0 || middle_tip_npo_ids.Count() == 0)
                        continue;

                    var middleResult = foundTreeObjectTable.Where(x => middle_tip_npo_ids.Contains(x.tip_npo_id)).ToArray();

                    if (middleResult.Count() == 0)
                        continue;

                    string unselected_middle_tip_npo_names = string.Join(", ", middleClassification.Value.Where(x => !selected_middle_tip_npo_ids.Contains(x.Id)).Select(x => x.Name));

                    for (int index = 0; index < middleResult.Count(); index++)
                    {
                        var downResult = middleResult[index];
                        var parent_id = downResult.parent_id;
                        var parent_npo_id = downResult.parent_npo_id;

                        // Rename an object that is not selected but is in a group where at least one other object is selected.
                        if (!selected_middle_tip_npo_ids.Contains(downResult.tip_npo_id))
                        {
                            downResult.full_name = unselected_middle_tip_npo_names + (selected_middle_tip_npo_ids.Count() + 1 == middle_tip_npo_ids.Count() ? " отсутствует" : " отсутствуют");
                        }

                        // Check parents for using in presentation
                        while (!acceptedTipNpoIds.Contains(parent_npo_id) && parent_id != 0)
                        {
                            var parent_object = foundTreeObjectTable.First(x => x.id == parent_id);

                            parent_id = parent_object.parent_id;
                            parent_npo_id = parent_object.parent_npo_id;
                        }

                        downResult.parent_id = parent_id;
                        downResult.parent_npo_id = parent_npo_id;
                    }

                    middleResult.Reverse();

                    resultDictionary.Add(middleClassification.Key, middleResult);
                }
            }

            return Ok(resultDictionary);
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
