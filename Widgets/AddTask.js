class AddTask extends DOMElement{
  static TYPE = 0;
  static DATA = {
		"UUID": "",
		"PARENT": 0,
		"TITLE": "",
		"START_DATE": "",
		"START_TIME_SET": 0,
		"DUE_DATE": "",
		"DUE_DATE_PROJECT": "",
		"DUE_TIME_SET": 0,
		"DUE_DATE_MODIFIER": "0",
		"REMINDER": -1,
		"ALARM": "",
		"REPEAT_NEW": "",
		"REPEAT_FROM": 0,
		"DURATION": 0,
		"STATUS": 0,
		"CONTEXT": 0,
		"GOAL": 0,
		"FOLDER": 0,
		"TAG": [],
		"STARRED": 0,
		"PRIORITY": 0,
		"NOTE": "",
		"COMPLETED": "",
		"TYPE": 0,
		"TRASH_BIN": "",
		"IMPORTANCE": 0,
		"METAINF": "",
		"FLOATING": 0,
		"HIDE": 0,
		"HIDE_UNTIL": 0
  }

  
  updateUI() {
    this.ui = (new Task({...this.constructor.DATA})).render().addClass('new');
  }
  

}