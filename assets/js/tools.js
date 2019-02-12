class Tools
{
	static removePartOfString(str, wordBecomeBy, sizeToRemove)
	{
		let cutStartIndex = str.indexOf(wordBecomeBy);
		return str.substr(0, cutStartIndex) + str.substr(cutStartIndex + sizeToRemove);
	}
}