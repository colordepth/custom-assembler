########################################

# AUTHORS (Group 20):

# Deep Sharma 2020370
# Dhruv Malik 2020373
# Karan Singh 2020383


# Defines exception classes

########################################


class CompileError(Exception):
	"""
	Attributes:
		origin -- name of function where error is caught
		message -- explanation of the error
		line_number -- Line number in input file where error occured
		code -- exact code where error ocurred. Ex- "add R1 R10 R20"
	"""

	def __init__(self, origin, message, line_number=None, code=None):
		self.origin = origin
		self.message = message
		self.line_number = line_number
		self.code = code